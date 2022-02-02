import os
from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from rest_framework.fields import CurrentUserDefault

from .models import Book,Category,Rating
from rest_framework.response import Response


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('pk','username','first_name','last_name',)


class UserSerializerWithToken(serializers.ModelSerializer):

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(required=True, allow_blank=False)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        username = validated_data.pop('username',None)
    
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance



    class Meta:
        model = User
        fields = ('token','username','first_name','last_name', 'password')






class BookSerializer(serializers.ModelSerializer):


    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance



    class Meta:
        model = Book
        fields=('title','imageFile','description','bookFile')



class CategorySerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance

    class Meta:
        model = Category
        fields=("categoryName",)



class RatingSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance

    class Meta:
        model = Rating
        fields = '__all__'
