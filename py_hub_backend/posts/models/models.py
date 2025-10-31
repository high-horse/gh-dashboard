from heapq import nlargest

from django.db import models

# Create your models here.
from django.db import models
from django.utils import  timezone
from django.conf import  settings


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        # only returns where deleted_at is null
        return  super().get_queryset().filter(deleted_at__isnull=True)


class SoftDeleteModel(models.Model):
    deleted_at = models.DateTimeField(null=True, blank=True)

    # Managers
    objects = models.Manager()
    active =SoftDeleteManager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        self.deleted_at=timezone.now()
        self.save()


class PostType(models.TextChoices):
    BLOGPOST = 'BLOG', 'Blog'
    POST = 'POST', 'Post'

class Post(SoftDeleteModel):

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="posts")
    title = models.TextField(blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=50, choices=PostType.choices, default=PostType.POST)

    image_url = models.CharField(max_length=1024, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'posts'
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'
        ordering = ['-created_at']

    def __str__(self):
        return f"Post by {self.author.username} at {self.created_at}"

class Comment(SoftDeleteModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    patent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'comments'
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
        ordering = ['-created_at']

    def __str__(self):
        return f"Post by {self.author.username} on Post {self.post.id}"


class Vote(SoftDeleteModel):
    VOTE_TYPE = [
        (1, 'Upvote'),
        (-1, 'Downvote'),
    ]

    value = models.SmallIntegerField(choices=VOTE_TYPE)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True, related_name='votes')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True, related_name='votes')

    class Meta:
        db_table = 'votes'
        verbose_name = 'Vote'
        verbose_name_plural = 'Votes'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'post'],
                condition=models.Q(deleted_at__isnull=True),
                name='unique_user_post_vote'
            ),
            models.UniqueConstraint(
                fields=['user', 'comment'],
                condition=models.Q(deleted_at__isnull=True),
                name='unique_user_comment_vote'
            ),
        ]

    def __str__(self):
        target = self.post or self.comment
        return f"{self.user.username} voted {self.get_value_display()} on {target}"
