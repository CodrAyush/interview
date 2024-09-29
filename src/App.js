import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import logo from './logo.png';

// List of cities
const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "San Francisco",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Washington",
  "Jabalpur",
  "Jharkhand",
  "Jhansi"
];

const Navbar = () => {
  const [showNewInterface, setShowNewInterface] = useState(false);
  const [searchData, setSearchData] = useState({
    location: 'Anywhere',
    checkIn: new Date(),
    checkOut: new Date(),
    guests: '1 Guest',
  });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isCityDropdownVisible, setIsCityDropdownVisible] = useState(false);

  const dropdownRef = useRef();
  const cityDropdownRef = useRef();
  const newInterfaceRef = useRef();  // Ref for second interface

  const handleSearchClick = () => {
    setDropdownVisible(false);
    setIsCityDropdownVisible(false);
    const fadeOutDuration = 600;
    const navbarContainer = document.getElementById('navbar-container');
    navbarContainer.style.transition = `opacity ${fadeOutDuration}ms ease-in-out`;
    navbarContainer.style.opacity = 0;

    setTimeout(() => {
      setShowNewInterface(true);
    }, fadeOutDuration);
  };

  const handleDateChange = (date, type) => {
    setSearchData((prevData) => ({
      ...prevData,
      [type]: date,
    }));
  };

  const handleGuestSelection = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const updateGuests = () => {
    const totalGuests = adults + children;
    setSearchData((prevData) => ({
      ...prevData,
      guests: `${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}`,
    }));
  };

  const handleCityInputChange = (e) => {
    const input = e.target.value;
    setSearchData((prevData) => ({
      ...prevData,
      location: input,
    }));
    if (input.length > 0) {
      const filteredCities = cities.filter((city) =>
        city.toLowerCase().startsWith(input.toLowerCase())
      );
      setCitySuggestions(filteredCities);
      setIsCityDropdownVisible(true);
    } else {
      setIsCityDropdownVisible(false);
    }
  };

  const handleCitySelect = (city) => {
    setSearchData((prevData) => ({
      ...prevData,
      location: city,
    }));
    setIsCityDropdownVisible(false);
  };

  useEffect(() => {
    updateGuests();
  }, [adults, children]);

  // Close dropdowns when clicking outside of them and handle closing the second interface
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setIsCityDropdownVisible(false);
      }
      // Close second interface when clicking outside of it
      if (newInterfaceRef.current && !newInterfaceRef.current.contains(event.target)) {
        // Update searchData before closing
        setSearchData((prevData) => ({
          ...prevData,
          // Ensure that the selected dates and location are updated
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut,
        }));
        setShowNewInterface(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchData]);

  return (
    <div>
      <nav
        id="navbar-container"
        style={{ ...styles.navbar, opacity: showNewInterface ? 0 : 1 }}
      >
        <div style={styles.logoSection}>
          <img src={logo} alt="logo" style={styles.logo} />
          <span style={styles.brandName}>bnbIndia</span>
        </div>

        <div style={styles.searchSection} onClick={handleSearchClick}>
          <input type="text" value={searchData.location} style={styles.searchInput} readOnly />
          <input type="text" value={`${searchData.checkIn.toLocaleDateString()} - ${searchData.checkOut.toLocaleDateString()}`} style={styles.searchInput} readOnly />
          <input type="text" value={searchData.guests} style={styles.searchInput} readOnly />
          <button style={styles.searchButton}>
            <FaSearch color="white" />
          </button>
        </div>

        <div style={styles.hostSection}>
          <span>host panel</span>
          <img src={logo} alt="logo" style={styles.logo} />
        </div>
      </nav>

      {showNewInterface && (
        <div style={styles.newInterface} ref={newInterfaceRef}>
          <div style={styles.navigationLinks}>
            <span style={styles.navLink}>Stays</span>
            <span style={styles.navLink}>Nearby Places</span>
          </div>

          <div style={styles.newInterfaceRow} ref={cityDropdownRef}>
            <label>Where</label>
            <input
              type="text"
              placeholder="Search places"
              style={styles.newInterfaceInput}
              value={searchData.location}
              onChange={handleCityInputChange}
            />
            {isCityDropdownVisible && citySuggestions.length > 0 && (
              <div style={styles.cityDropdown}>
                {citySuggestions.map((city, index) => (
                  <div
                    key={index}
                    style={styles.cityDropdownItem}
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.dateContainer}>
            <div style={styles.newInterfaceRow}>
              <label>Check in</label>
              <div style={styles.datePickerContainer}>
                <DatePicker
                  selected={searchData.checkIn}
                  onChange={(date) => {
                    handleDateChange(date, 'checkIn');
                    if (searchData.checkOut < date) {
                      setSearchData((prevData) => ({
                        ...prevData,
                        checkOut: date,
                      }));
                    }
                  }}
                  dateFormat="MMM d, yyyy"
                  minDate={new Date()}
                  customInput={<input style={styles.newInterfaceInput} />}
                />
                <FaCalendarAlt style={styles.calendarIcon} />
              </div>
            </div>

            <div style={styles.newInterfaceRow}>
              <label>Check out</label>
              <div style={styles.datePickerContainer}>
                <DatePicker
                  selected={searchData.checkOut}
                  onChange={(date) => handleDateChange(date, 'checkOut')}
                  dateFormat="MMM d, yyyy"
                  minDate={searchData.checkIn}
                  customInput={<input style={styles.newInterfaceInput} />}
                />
                <FaCalendarAlt style={styles.calendarIcon} />
              </div>
            </div>
          </div>

          <div style={styles.newInterfaceRow} ref={dropdownRef}>
            <label onClick={handleGuestSelection} style={{ cursor: 'pointer' }}>
              Who
            </label>
            <input
              type="text"
              placeholder="Number of guests"
              style={styles.newInterfaceInput}
              value={searchData.guests}
              readOnly
            />
            {dropdownVisible && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownItem}>
                  <label>Adults</label>
                  <input
                    type="number"
                    min="0"
                    value={adults}
                    onChange={(e) => setAdults(Math.max(0, Number(e.target.value)))}
                    style={styles.numberInput}
                  />
                </div>
                <div style={styles.dropdownItem}>
                  <label>Children</label>
                  <input
                    type="number"
                    min="0"
                    value={children}
                    onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                    style={styles.numberInput}
                  />
                </div>
                <div style={styles.dropdownItem}>
                  <label>Pets</label>
                  <input
                    type="number"
                    min="0"
                    value={pets}
                    onChange={(e) => setPets(Math.max(0, Number(e.target.value)))}
                    style={styles.numberInput}
                  />
                </div>
              </div>
            )}
          </div>

          <button style={styles.newInterfaceButton} onClick={() => setShowNewInterface(false)}>
            Search
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '40px',
    height: '40px',
  },
  brandName: {
    fontSize: '20px',
    marginLeft: '10px',
  },
  searchSection: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    padding: '10px',
    marginRight: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  searchButton: {
    backgroundColor: '#ff5a5f',
    border: 'none',
    padding: '10px 20px',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  hostSection: {
    display: 'flex',
    alignItems: 'center',
  },
  newInterface: {
    padding: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '10px',
    marginTop: '20px',
    width: '80%',
    marginLeft: '10%',
    transition: 'opacity 0.6s ease-in-out',
  },
  newInterfaceRow: {
    marginBottom: '15px',
  },
  newInterfaceInput: {
    padding: '10px',
    width: '100%',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '10px',
    marginTop: '5px',
    zIndex: 1,
  },
  dropdownItem: {
    marginBottom: '10px',
  },
  numberInput: {
    width: '50px',
    padding: '5px',
  },
  dateContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  datePickerContainer: {
    position: 'relative',
  },
  calendarIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  newInterfaceButton: {
    backgroundColor: '#ff5a5f',
    border: 'none',
    padding: '10px 20px',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  cityDropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    zIndex: 2,
    marginTop: '5px',
  },
  cityDropdownItem: {
    padding: '10px',
    cursor: 'pointer',
  },
};

export default Navbar;
