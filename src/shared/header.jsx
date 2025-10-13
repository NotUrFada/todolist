import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './header.module.css'; // Import CSS Module

const header = ({ title }) => {
  return (
    <header>
      <h1 className={styles.title}>{title}</h1>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) => {
            return isActive ? styles.active : styles.inactive;
          }}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => {
            return isActive ? styles.active : styles.inactive;
          }}
        >
          About
        </NavLink>
      </nav>
    </header>
  );
};

header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default header;
