var cachename="bloodcache";
var credentials=[
"./",
"./index.html",
"./js files/app.js",
"./style files/style.css",
"./pages/home.html",
"./pages/profile.html",
"./pages/signin.html",
"./pages/signup.html",
"./pages/post.html",
"./images/image.jpg",
"./images/images.png",
"./images/getimage.jpg",
"./images/save.png"
]
self.addEventListener("install",(event)=>{
event.waitUntil(
    caches.open(cachename).then((res)=>{
        console.log("caching data.....");
return res.addAll(credentials);
        }))
})
self.addEventListener("fetch",(e)=>{
const req=e.request;
// console.log(req,"req");
const Url=new URL(req.url);
    // console.log(Url,"Url");
if(Url.origin==location.origin)
{
    e.respondWith(cachefrst(req))
}
else{
    e.respondWith(netfirst(req))
}

})

async function cachefrst(req)
{
const response = await caches.match(req);
return response || fetch(req);
}


async function netfirst(req)
{
const response=await caches.open(cachename);
try {
    const res = await fetch(req);
    response.put(req, res.clone())
    return res
} catch (error) {
    return await response.match(req)
}
}