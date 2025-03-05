const form = document.querySelector("form"),
eInput = form.querySelector(".input"),
text = form.querySelector(".text");

form.addEventListener("submit", (e)=>{
  e.preventDefault(); 
  let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; 
  form.classList.add("error");
  form.classList.remove("valid");
  if(eInput.value == ""){
    text.innerText = "Ingrese su Gmail";
  }else if (!eInput.value.match(pattern) ) { 
    text.innerText = "Ingrese un Gmail valido";
  }else{
    form.classList.replace("error" , "valid"); 
    text.innerText = "Pronto nos pondremos en contacto";
  }
});