const httpGetAsync = (theUrl, callback) =>
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true)
    xmlHttp.send(null);
}

let imagesOnPage = document.getElementsByTagName("img")

const cb = () => {
  for (let img of imagesOnPage) {
    //img.addEventListener("click", logSRC(img.getAttribute("src")), false)
    let imgSRC = img.getAttribute('src')
    let encodedImgSRC = encodeURIComponent(imgSRC)
  
    img.addEventListener('click', () => httpGetAsync(`http://localhost:8000/caption/${encodedImgSRC}`, (res) => console.log(res)))
  }
}


setTimeout (cb, 1000)