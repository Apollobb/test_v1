# -*- coding: utf-8 -*-
import os

user = 'kill'
pwd = 'kill007~@#'

class Config(object):

    DEBUG = False
    # 是否是开发模式
    DEV = False

    # SECRET_KEY = '\x9bl\xbc\xc6\x01\xaf^\r\x13\xb2\xb2T\xce\x87d\xd1\xf5\x07\xb6r\x8c\r\xe8\x93'

    #数据库iamdcdb
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://%s:%s@39.107.89.240:50008/cmdb_test?charset=utf8" %(user,pwd)

    # 日志文件
    LOG_FILE = "ops.log"

class DevConfig(Config):

    DEBUG = True
    # 开发模式
    DEV = True

    # 数据库iamdcdb
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://%s:%s@39.107.89.240:50008/cmdb_test?charset=utf8" %(user,pwd)
