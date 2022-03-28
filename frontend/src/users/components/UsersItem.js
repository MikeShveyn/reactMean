import React from "react";
import {Link} from "react-router-dom";
import Avatar from '../../shared/components/UIElements/Avatar/Avatar';
import Card from "../../shared/components/UIElements/Card/Card";
import './UserItem.css';

const UsersItem = props => {
    return <li className="user-item">
            <Card className="user-item-content">
                <Link to={`/${props.id}/posts`}>
                    <div className="user-item-image">
                        <Avatar image={props.image} alt={props.name}/>
                    </div>
                    <div className="user-item-info">
                        <h2>{props.name}</h2>
                        <h3>
                            {props.postCount}
                            {props.postCount === 1 ? ' Post' : ' Posts'}
                        </h3>
                    </div>
                </Link>
            </Card>
    </li>
};

export default UsersItem;