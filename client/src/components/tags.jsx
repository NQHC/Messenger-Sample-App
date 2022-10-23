
import '../pages/Styles.css';

export default function Tag({TagName}){

    return (
        <div>
        <input type="checkbox" id={TagName} className="invisibleCheck"  />
        <label for={TagName} className = "tag">{TagName}</label>
        </div>
    );

}
// <input type="checkbox" id="tags" className="invisibleCheck"  />
//<label for="tags" className = "tag">TEST</label>