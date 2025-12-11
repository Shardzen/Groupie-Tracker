# Exercise Api Initiation 

## objective:
  Your goal is to create a program that will request an api and retrieve its information, you will use the go packages to perform your program,once the data retrieved   is in the Map, display the data from your map as shown at the end of the exercise.

## Documentation
> -  [http](https://pkg.go.dev/net/http)
> -  [ioutil](https://pkg.go.dev/io/ioutil)
> -  [map](https://golangdocs.com/maps-in-golang)
  
## Ressources
> - [structures](https://www.youtube.com/watch?v=l61iFr5Y8yw&list=PL9kmVGsnZbLClva-6F7T2cZ-0L9gU0ghA&t=1s)
> - [public api](https://github.com/public-apis/public-apis)
> - [get request](https://zetcode.com/golang/getpostrequest/)
> - [json](https://www.sohamkamani.com/golang/json/)

### Instruction
  you will have to: 
 - request api 
 - retrieve data  
 - send it in strcuture 
 - put data on map 
 - display data with map key.

### Part 1:
 - Api used by default : https://rickandmortyapi.com/api/character/
 - Select your api among all the api
 - Make a request to retrieve data

### Part 2: 
 -   retrieve data and sort them with map using json and structures
 
 ```
 type Personnage struct {
      Data1   int
      Data2 string
 }
 ```
 
 ### Result : 
 
 ```
  fmt.Print(YourMap["Objc"])
   
  return [data, data , data]
 ```
 
![2022-07-20 11-35-31_Trim](https://user-images.githubusercontent.com/90843876/179950662-2d425f1d-829b-4be2-9653-23867cd71b82.gif)
