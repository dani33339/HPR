import pymysql.cursors

class Db:
    def __init__(self):
        self.host = 'localhost'
        self.user = 'your_user'
        self.password = 'your_password'
        self.database = 'hpr'
        self.connection = None
        self.cursor = None

    def connect(self):
        self.connection = pymysql.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database,
            cursorclass=pymysql.cursors.DictCursor
        )
        self.cursor = self.connection.cursor()

    def execute_query(self, query, params=None):
        if not self.cursor:
            self.connect()
        self.cursor.execute(query, params)
        result = self.cursor.fetchall()
        return result
    
    def execute_insert(self, query, params=None):
        if not self.cursor:
            self.connect()
        self.cursor.execute(query, params)
        self.connection.commit()