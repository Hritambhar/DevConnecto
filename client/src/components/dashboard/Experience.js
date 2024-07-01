import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteExperience } from '../../action/profile';
import formatDate from '../../utils/formatDate';

const Experience = ({ experience, deleteExperience }) => {
  const experiences =
    experience && experience.length > 0 ? (
      experience.map((exp) => (
        <tr key={exp._id}>
          <td>{exp.company}</td>
          <td className='hide-sm'>{exp.title}</td>
          <td>
            {formatDate(exp.from)} - {exp.to ? formatDate(exp.to) : 'Now'}
          </td>
          <td>
            <button
              onClick={() => deleteExperience(exp._id)}
              className='btn btn-danger'
            >
              Delete
            </button>
          </td>
        </tr>
      ))
    ) : (
      <p>No experience credentials found.</p>
    );

  return (
    <Fragment>
      <h2 className='my-2'>Experience Credentials</h2>
      {experiences}
    </Fragment>
  );
};

Experience.propTypes = {
  experience: PropTypes.array.isRequired,
  deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
