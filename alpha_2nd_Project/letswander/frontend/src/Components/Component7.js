import testi from "./../Assets/testimonial.jpg"
import quote from "./../Assets/quote.png"


 export default function Component7(props) {
    return(
        <>
        <div class="section-7">
    <p class="s7-p1">TESTIMONIALS</p>
    <p class="s7-p2">What people says about us...</p>
    <div class="s7-cont">

        <div class="s7-div1 s7-div">
            <img src={quote}/>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet ipsam, quam provident accusamus expedita repudiandae!</p>
            <img class="testi-img" src={testi}/>
            <p class="testi-p2">CEO, Founder</p>
        </div>

        <div class="s7-div2 s7-div">
            <img src={quote}/>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet ipsam, quam provident accusamus expedita repudiandae!</p>
            <img class="testi-img" src={testi}/>
            <p class="testi-p2">CEO, Founder</p>
        </div>

        <div class="s7-div3 s7-div">
            <img src={quote}/>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet ipsam, quam provident accusamus expedita repudiandae!</p>
            <img class="testi-img" src={testi}/>
            <p class="testi-p2">CEO, Founder</p>
        </div>
    </div>
</div>
        </>
    )
 }