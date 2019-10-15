class test:


    def getString(self):
        print ('aaa')
        return 'aaa'

    def test_01(self):
        ll = []
        temp = self.getString()
        if temp :
            ll.append(temp)

        if temp:
            ll.append(temp)

        if temp:
            ll.append(temp)
        return  ll

if __name__ == '__main__':
    p = test()
    print (p.test_01())

# class test:
#
#
#     def getString(self):
#         print('aaa')
#         return 'aaa'
#
#     def test_01(self):
#         ll = []
#         temp = self.getString()
#         if self.getString()  :
#             ll.append(self.getString())
#         if self.getString():
#             ll.append(self.getString())
#
#         if self.getString():
#             ll.append(self.getString())
#         return  ll
#
# if __name__ == '__main__':
#     p = test()
#     print (p.test_01())
