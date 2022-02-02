from django.db import models
from django.contrib.auth.models import User





class Category(models.Model):
    categoryName = models.CharField(max_length=40)
    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.categoryName



class Book(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE,)
    category = models.ForeignKey(Category,db_column="category_id",related_name="category_id",on_delete=models.CASCADE,default=1)
    title = models.CharField(max_length=50)
    imageFile = models.FileField(db_index=True, upload_to='images/',default=None,null=True)
    description = models.TextField(max_length=2000,default="No Description")
    bookFile =  models.FileField(db_index=True, upload_to='books/',default=None,null=True)
    ratings = models.IntegerField(default=0)    


class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,)
    Book = models.ForeignKey(Book,on_delete=models.CASCADE)