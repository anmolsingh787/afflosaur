import base64
import binascii
s = 'VYLE1BQUksTUFBTyxRQUFPLENBQUM7QUFDbkIsU0FBTztBQUNUOyIsIm5hbWVzIjpbXX0='
print(binascii.hexlify(base64.b64decode(s)))
print(base64.b64decode(s))
