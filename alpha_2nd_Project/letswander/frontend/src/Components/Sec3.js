

export default function Sec3(props) {
    console.log(props.data.exclusions)
    return (
        <>
         <div className="incl-excl-cont">
            <div className="incl-cont">
                {props.data.inclusions && props.data?.inclusions.map((incl)=>(
                <div>👉 &nbsp;{incl}<br></br></div>
                ))}
            </div>

            <div className="excl-cont">
                {props.data.exclusions && props.data?.exclusions.map((excl)=>(
                <p>👉 &nbsp;{excl}</p>
                ))}
            </div>
        </div>


        </>
    )
}