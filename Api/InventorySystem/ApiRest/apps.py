from django.apps import AppConfig


class ApirestConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ApiRest'

    def ready(self):
        import ApiRest.signals