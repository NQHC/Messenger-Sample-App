
import '../pages/Styles.css';
import chatwindow from '../pages/Chat.jsx';
export default function ChatBar ({chat}){

    return (
        <div style = {Style}><div style = {{position: 'absolute', left:'35px',bottom:'30%'}}>{chat}</div></div>
    );

}
const Style = {
    position: 'absolute',
    left:'120px',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '8vh',
    width: 'calc(100% - 120px)',
    backgroundColor: '#D2E5D0',
    fontFamily: ' Helvetica, Arial, sans-serif',
    fontSize:'24px',
}