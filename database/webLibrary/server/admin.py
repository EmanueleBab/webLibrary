from django.contrib import admin

from .models import Book,Category,Rating


class BookAdmin(admin.ModelAdmin):
    fields = ('title', 'author','category', 'ratings','imageFile','description','bookFile')
    list_display = ('title', 'author','category', 'ratings')
    list_filter = ('title','category','ratings')


# Register your models here.
admin.site.register(Book,BookAdmin)



class CategoryAdmin(admin.ModelAdmin):
    fields = ('categoryName',)
    list_display = ('categoryName',)




# Register your models here.
admin.site.register(Category,CategoryAdmin)



class RatingAdmin(admin.ModelAdmin):
    fields = ('user','Book')
    list_display =('user','Book')


admin.site.register(Rating,RatingAdmin)
