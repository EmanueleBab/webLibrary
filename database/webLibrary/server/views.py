from django.http import HttpResponseRedirect, response
from django.contrib.auth.models import User
from .models import Book,Category,Rating
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CategorySerializer, RatingSerializer, UserSerializer, UserSerializerWithToken,BookSerializer
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from django.core import serializers

from itertools import chain
from django.shortcuts import redirect


from django.db.models import Q, query

import os
import re
import collections

emailRe = re.compile('^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$')
passwordRe = re.compile( '^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$')

@api_view(['GET'])  
def current_user(request):
  
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):


    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.initial_data["first_name"] is None or serializer.initial_data["last_name"] is None or passwordRe.match(serializer.initial_data["password"]) is None:
            return Response("", status=status.HTTP_400_BAD_REQUEST)
        serializer.initial_data["email"] = serializer.initial_data["username"]
        if emailRe.match(serializer.initial_data["email"]) is None:
            return Response("", status=status.HTTP_400_BAD_REQUEST)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def patch(self,request,format=None):
        user = User.objects.get(pk = request.user.pk)
        if(request.data["email"] is not ""):
            if emailRe.match(request.data["email"]) is None:
                return Response("email", status=status.HTTP_400_BAD_REQUEST)
            user.username = request.data["email"]
            user.email = request.data["email"]    
            user.save()  
        if(request.data["password"] is not ""):
            if passwordRe.match(request.data["password"]) is None:
                return Response("password", status=status.HTTP_400_BAD_REQUEST)
            user.set_password(request.data["password"])
            user.save()  
        if(request.data["firstName"] is not ""):
            user.first_name = request.data["firstName"]
            user.save()  
        if(request.data["lastName"] is not ""):
            user.last_name = request.data["lastName"]
            user.save()  
        return Response("ok", status=status.HTTP_200_OK)



class BookList(APIView):

    permission_classes = (IsAuthenticated,)

    def post(self,request):
        print(request.data["bookFile"])
        if not "bookFile" in request.data or not "title" in request.data :
            return Response("error", status=status.HTTP_400_BAD_REQUEST)
        
        if "bookFile" in request.data:
            if request.data["bookFile"] is "":
                print("ehoh")
                return Response("error", status=status.HTTP_400_BAD_REQUEST)

        if(os.path.split(request.data["bookFile"].name)[1].split('.')[-1] != "pdf"):
                print("ehoh")
                return Response("bad file format", status=status.HTTP_400_BAD_REQUEST)
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author = request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print("che marachelle")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)







    def get(self,request):
        if "authorPk" in request.query_params:
            if request.query_params["authorPk"] is not "": 
                query = Book.objects.filter(author=int(request.query_params["authorPk"])).values('pk','author','title','imageFile','description','bookFile','ratings')
                for i in query:
                    print(i["author"])
                    user =User.objects.get(pk =int(i["author"]))
                    i["author"] = user.first_name +" " + user.last_name
                    i['authorPk'] = user.pk
          
                return JsonResponse(list(query), safe=False)

        if "authorId" in request.query_params:
            if request.query_params["authorId"] is not "":  
                if len(request.query_params["title"].split()) >1:

                    author = User.objects.filter((Q(first_name__icontains=request.query_params["title"].split()[0]) | Q(last_name__icontains=request.query_params["title"].split()[1]))).first()
                    query = Book.objects.filter(author=author).values('pk','author','title','imageFile','description','bookFile','ratings').order_by("-ratings")

                    for i in query:
                        user =User.objects.get(pk =int(i["author"]))
                        i["author"] = user.first_name +" " + user.last_name
                        i['authorPk'] = user.pk
              
                    if author is not None:
                        return JsonResponse(list(query), safe=False)
                    author = User.objects.filter((Q(first_name__icontains=request.query_params["title"].split()[1]) | Q(last_name__icontains=request.query_params["title"].split()[0]))).first()
                    query = Book.objects.filter(author=author).values('pk','author','title','imageFile','description','bookFile','ratings').order_by("-ratings")

                    for i in query:
                        user =User.objects.get(pk =int(i["author"]))
                        i["author"] = user.first_name +" " + user.last_name
                        i['authorPk'] = user.pk
              
                    return JsonResponse(list(query), safe=False)

                else:
                    author = User.objects.filter((Q(first_name__icontains=request.query_params["title"]) | Q(last_name__icontains=request.query_params["title"]))).first()
                    query = Book.objects.filter(author=author).values('pk','author','title','imageFile','description','bookFile','ratings').order_by("-ratings")
                    for i in query:
                        print(i["title"])
                        user =User.objects.get(pk =int(i["author"]))
                        i["author"] = user.first_name +" " + user.last_name
                        i['authorPk'] = user.pk
              
                    return JsonResponse(list(query), safe=False)


        if "bookId" in request.query_params:
            if request.query_params["bookId"] is not "":
                query = Book.objects.filter(pk=request.query_params["bookId"]).values('pk','author','title','imageFile','description','bookFile','ratings').order_by("-ratings")
                for i in query:
                    user =User.objects.get(pk =int(i["author"]))
                    i["author"] = user.first_name +" " + user.last_name
                    i['authorPk'] = user.pk
          
                return JsonResponse(list(query), safe=False)



        query = Book.objects.all().values('pk','author','title','imageFile','description','bookFile','ratings').order_by("-ratings")


        if "title" in request.query_params:
            query = query.filter(title__icontains=request.query_params["title"]) #uguale a %nome$ in SQL SELECT ... WHERE string LIKE '%pattern%';
        if  "category" in request.query_params:
            if request.query_params["category"] is not "":  
                query = query.filter(category = Category.objects.get(categoryName = request.query_params["category"]))
        query = query[:10]
        for i in query:
            user =User.objects.get(pk =int(i["author"]))
            i["author"] = user.first_name +" " + user.last_name
            i['authorPk'] = user.pk
  

        return JsonResponse(list(query), safe=False)

    def delete(self,request):
        query = Book.objects.get(pk=int(request.query_params["bookId"]))
        if(query.author == request.user):
            query.delete()
            return Response("deleted", status=status.HTTP_200_OK)
        return Response("unauthorized",status=status.HTTP_401_UNAUTHORIZED)
        




class CategoryList(APIView):
    permission_classes = (IsAuthenticated,)


    def get(self,request):
        query = Category.objects.all().values("categoryName").order_by("categoryName")
        return JsonResponse(list(query), safe=False)

    def post(self,request):
        if not request.user.is_superuser:
            return Response(("permission denied"),status=status.HTTP_401_UNAUTHORIZED)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        



class Ratings(APIView):
    permission_classes = (IsAuthenticated,)


    def post(self,request):
        book = Book.objects.get(pk=int(request.query_params["bookId"]))
        rating = Rating.objects.filter(Book = book,user = request.user).exists()
        if(rating):
            return Response(("permission denied"),status=status.HTTP_401_UNAUTHORIZED)

        val = {
            'Book':book.pk,
            'user':request.user.pk,

        }
        serializer = RatingSerializer(data=val)
        if(serializer.is_valid()):
            book.ratings = Rating.objects.filter(Book = book).count() +1
            book.save()
            serializer.save()
            return Response("ok", status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self,request):
        book = Book.objects.get(pk=int(request.query_params["bookId"]))
        rating = Rating.objects.filter(Book = book,user = request.user).exists()
        if rating:
            return Response("1", status=status.HTTP_200_OK)
        return Response("0", status=status.HTTP_200_OK)

 


def redirectLogin(request):
    response = redirect('/redirect-success/')
    return response