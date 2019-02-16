# Step to reproduce

Run command: `docker-compose up`

## SQL init:
```
I did't have time to automate this part.
```
- Using any SQL manager open connection to mysql `localhost:3306 user:root, pass:secret`.
- Go to database `2pc`
- Run sql query from `dump.sql` file.

After you can start test 2pc protocol using HTTP requests. It works using POST requests, so you can use PostMan for example to test it.

# Application abstract
It is api that allow you to make shipping and payment. If any of this operation fails it is aborting another one (2pc protocol).
if operation if success if returns `{ successful: true }`, otherwise `{ success: false }`

## Valid cases
- Make request to `localhost:3000/ship_and_pay` with body:
```
{
	"payment": {
		"user_name": string,
		"amount": number
	},
	"shipping": {
		"item_name": string,
	    "price": number
	}
}
```
This should return success response and new rows in payment and shipping tables have created.

If ony of object is not valid (missing field or wrong types), any of rows will be created and failed response will be returned.
