// post request handler
async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });
  return response;
}

//HTML collection of images on the webpage
let imagesOnPage = document.getElementsByTagName("img")

const cb = () => {
  for (let img of imagesOnPage) {
    
    //get image src attribte
    imgSRC = img.getAttribute("src")
    
    //create a button
    button = document.createElement("button")
    button.innerHTML = "Generate Caption"
    button.addEventListener('click',
      async function (){
        button.disabled = true
        button.innerHTML = "Generating Caption"

        //pass the image caption to the Python server
        postData('http://localhost:8000/caption/', {"url":imgSRC}).then(
          (res) => res.text()).then(
            (caption) => {
              img.setAttribute("alt", caption)
              button.innerHTML = "Caption Generated"
            }
          )
          }
    )
    //insert be button next to the image
    img.insertAdjacentElement("afterend", button)
  }
}

//wait one second for images to load before adding buttons
setTimeout (cb, 1000)