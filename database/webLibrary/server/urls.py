from django.urls import path
from .views import current_user, UserList,BookList,CategoryList,Ratings


urlpatterns = [
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    path('books/',BookList.as_view()),
    path('categories/',CategoryList.as_view()),
    path('rate/',Ratings.as_view()),



]



