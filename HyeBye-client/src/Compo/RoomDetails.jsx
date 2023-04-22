import './chat.css';
import { useSelector } from 'react-redux';
import { setUsers } from '../reducers/users.js';


const RoomDetails = (props) => {
    const roomCode = useSelector((state) => state.code);
    const users = useSelector((state) => state.users);

    return (
        <div className='room-details' >
            <div className='room-code'>
                Room {roomCode.value.code}
                Peers: {users.value.count}
            </div>
            {/* <div>Peer Count : {props.userCount}</div> */}
        </div>
    )
}

export default RoomDetails