var btn = document.querySelectorAll(".drum")
btn.forEach((name,index)=>{
   name.addEventListener('click',(event)=>{
    name.style.color="#fff";
    makesound(name.innerText)
    btn_an(name.innerText);
})
name.addEventListener("mouseout",()=>{
    name.style.color="#DA0463"
    
})
}
)
document.addEventListener("keypress",(evt)=>{
   makesound(evt.key)
   btn_an(evt.key)

})

function makesound(key) {
    switch (key) {
        case "w":
            var audio = new Audio('/sounds/tom-1.mp3');
            audio.play();
            break;
            case "a":
            var audio = new Audio('/sounds/tom-2.mp3');
            audio.play();
            break;
            case "s":
                var audio = new Audio('/sounds/tom-3.mp3');
            audio.play();
            break;
            case "d":
                var audio = new Audio('/sounds/tom-4.mp3');
            audio.play();
            break;
            case "j":
                var audio = new Audio('/sounds/snare.mp3');
            audio.play();
            break;
            case "k":
                var audio = new Audio('/sounds/crash.mp3');
            audio.play();
            break;
            case "l":
                var audio = new Audio('/sounds/kick-bass.mp3');
            audio.play();
            break;
            
    
        default:
            console.log("error 01 \n Unknown button pressed")
            break;
    }
    
}
function btn_an(c_key) {
    var active_btn = document.querySelector("."+c_key);
    if(active_btn != null){
        active_btn.classList.add("pressed")
        setTimeout(()=>{
            active_btn.classList.remove("pressed")
        },200)
    }
   
}