

export function colorSelect () {
   const colorArray = ['#c56cf0','#3ae374','#17c0eb','#7158e2','#ff4d4d','#ffaf40','#474787','#ffb142'] ;
   const leng = colorArray.length; 
   const randomColor = colorArray[Math.floor(Math.random()*leng)] ; 
   return randomColor ; 


}