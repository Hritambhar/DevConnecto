import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
  profile: {
    bio,
    skills = [], // Default skills to an empty array if undefined
    user: { name },
  },
}) => (
  <div className='profile-about bg-light p-2'>
    {bio && (
      <Fragment>
        <h2 className='text-primary'>{name.trim().split(' ')[0]}'s Bio</h2>
        <p>{bio}</p>
        <div className='line' />
      </Fragment>
    )}
    <h2 className='text-primary'>Skill Set</h2>
    <div className='skills'>
      {skills.length > 0 ? (
        skills.map((skill, index) => (
          <div key={index} className='p-1'>
            <i className='fas fa-check' /> {skill}
          </div>
        ))
      ) : (
        <p>No skills listed</p>
      )}
    </div>
  </div>
);

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
