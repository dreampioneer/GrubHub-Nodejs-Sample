# GRUBHUB NODEJS SAMPLE

As you can check the documentation on <https://developer.grubhub.com/>, There are Java and Python sample codes on the Documentation.
I know that you can change Java or Python code to nodejs code and just hope this code helps a lot of nodejs developers who are going to integrate GrubHub APIs. 😀

## Something that I realize during integration of API

* When you are going to get orders from Grubhub, there are some orders on your restaurant but the API returns status code 200 and empty array.
Please check your and your restaurant's time zone.

* In APIs, merchant_long_id is same as merchant_id

> from dreampioneer
