

export function checkAlphanum (str) {
    var n1 = false; 
    var n2 = false ;
  const bigstring = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; 
  const smallnumbers = '0123456789'; 

  for ( var chr in str) {    
      if(bigstring.indexOf(str[chr])>=0) {
            n1 =true ;
      }
      if (smallnumbers.indexOf(str[chr])>=0) {
          n2 = true ; 
      }
      
  }

   return n1 && n2 ;
}

