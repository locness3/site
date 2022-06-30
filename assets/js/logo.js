// make $id a shorthand for document.getElementById
$id = document.getElementById.bind(document);

// check support for css animations
// adapted from https://docs.w3cub.com/css/css_animations/detecting_css_animation_support.html
var animation = false;
elem = document.createElement('div');
//if( elem.style.animationName !== undefined ) { animation = true; }
if( elem.style.transition !== undefined ) { animation = true; }

// get the total left and top offset of el
// from https://www.quirksmode.org/js/findpos.html
function getPos(el) {
    var elLeft = 0, elTop = 0;
    // add the left and top offset of el and all its offsetParents
    do {
        elLeft += el.offsetLeft;
        elTop += el.offsetTop;
    } while (el = el.offsetParent);

    return [elLeft, elTop];
}

if (animation == true && sessionStorage.getItem("playedAnimatedLogo") < 1) {
    // display the overlay
    $id("animated-logo-overlay").style.display = "flex";

    // when the video is loaded (so it has proper width and height)
    $id("video-logo").addEventListener("loadeddata", () => {
        // set the video logo's absolute position to its current automatic position
        // allowing it to animate to another position later
        videoLogoPos = getPos($id("video-logo"));
        $id("video-logo").style.left = videoLogoPos[0] + "px";
        $id("video-logo").style.top = videoLogoPos[1] + "px";
    })

    // https://developer.chrome.com/blog/play-returns-promise/
    var playPromise = $id("video-logo").play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // visually hide the static logo
            $id("static-logo").style.opacity = 0;
            // set the static lgoo's max width to the width of the video
            //$id("static-logo").style.maxWidth = "712px";

            // when the animation ends, transition to the static logo
            $id("video-logo").addEventListener("ended", () => {
                // set the animated logo's absolute position to the automatic position of the static logo
                // this is animated with css transitions
                staticLogoPos = getPos($id("static-logo"));
                $id("video-logo").style.left = staticLogoPos[0] + "px";
                $id("video-logo").style.top = staticLogoPos[1] + "px";

                // visually hide the overlay background
                // this is animated with a css transition
                $id("animated-logo-overlay").style.backgroundColor = "transparent";

                // after the css transitions are complete, replace the video logo by the static logo
                setTimeout(() => {
                    // visually show the static logo
                    $id("static-logo").style.opacity = 1;
                    // hide the overlay
                    $id("animated-logo-overlay").style.display = "none";
                }, 1000);

                sessionStorage.setItem("playedAnimatedLogo", 1);
            })
        })
        .catch((e) => {
            // hide the overlay
            $id("animated-logo-overlay").style.display = "none";
        })
    }
}