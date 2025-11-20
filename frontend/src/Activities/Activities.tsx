import { Link } from 'react-router';
import {activitiesData} from '../mocks/activities'

export const Activities = () => {
  const activities = activitiesData.activities; 
    return (
      <div>
        <h1>Activities</h1>
        {activities.map((activity) => (
          <Link to={`/activities/${activity.id}`} key={activity.id}>
            <h2>{activity.name}</h2>
            <p>{activity.description}</p>
          </Link>
        ))}
      </div>
    )
  }