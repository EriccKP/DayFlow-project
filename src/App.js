import React,{useState,useEffect,useCallback, useRef, startTransition} from "react";
import './App.css';
import Login from './Login'
import {fire,db,addDoc,collection,query,onSnapshot} from './fire';
import Hero from './Hero'


import TUICalendar from "@toast-ui/react-calendar";
import { ISchedule, ICalendarInfo } from "tui-calendar";

import "tui-calendar/dist/tui-calendar.css";
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";


const start = new Date();
const end = new Date(new Date().setMinutes(start.getMinutes() + 30));



function App() {

  const cal = useRef(null);

  const onClickSchedule = useCallback((e) => {
    const { calendarId, id } = e.schedule;
    const el = cal.current.calendarInst.getElement(id, calendarId);

    console.log(e, el.getBoundingClientRect());
  }, []);

  const onBeforeCreateSchedule = useCallback((scheduleData) => {
    console.log(scheduleData);

    const schedule = {
      id: String(Math.random()),
      title: scheduleData.title,
      isAllDay: scheduleData.isAllDay,
      start: scheduleData.start,
      end: scheduleData.end,
      category: scheduleData.isAllDay ? "allday" : "time",
      dueDateClass: "",
      location: scheduleData.location,
      state: scheduleData.state
    };



    cal.current.calendarInst.createSchedules([schedule]);
  }, []);

  const onBeforeDeleteSchedule = useCallback((res) => {
    console.log(res);

    const { id, calendarId } = res.schedule;

    cal.current.calendarInst.deleteSchedule(id, calendarId);
  }, []);

  const onBeforeUpdateSchedule = useCallback((e) => {
    console.log(e);

    const { schedule, changes } = e;

    cal.current.calendarInst.updateSchedule(
      schedule.id,
      schedule.calendarId,
      changes
    );
  }, []);

  function _getFormattedTime(time) {
    const date = new Date(time);
    const h = date.getHours();
    const m = date.getMinutes();

    return `${h}:${m}`;
  }

  function _getTimeTemplate(schedule, isAllDay) {
    var html = [];

    if (!isAllDay) {
      html.push("<strong>" + _getFormattedTime(schedule.start) + "</strong> ");
    }
    if (schedule.isPrivate) {
      html.push('<span class="calendar-font-icon ic-lock-b"></span>');
      html.push(" Private");
    } else {
      if (schedule.isReadOnly) {
        html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
      } else if (schedule.recurrenceRule) {
        html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
      } else if (schedule.attendees.length) {
        html.push('<span class="calendar-font-icon ic-user-b"></span>');
      } else if (schedule.location) {
        html.push('<span class="calendar-font-icon ic-location-b"></span>');
      }
      html.push(" " + schedule.title);
    }

    return html.join("");
  }

  const templates = {
    time: function (schedule) {
      console.log(schedule);
      return _getTimeTemplate(schedule, false);
    }
  };


  const [user,setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [emailError,setEmailError] = useState("");
  const [passwordError,setPasswordError] = useState("");
  const [hasAccount,setHasAccount] = useState(false);


  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  }

  const handleLogin= () =>  {
    clearErrors();
    fire
      .auth()
      .signInWithEmailAndPassword(email,password)
        .catch(err => {
          switch(err.code){
            case "auth/invalid-email":
            case "auth/user-disabled":
            case "auth/user-not-found":
              setEmailError(err.message);
              break;
            case "auth/wrong-password":
              setPasswordError(err.message);
              break;
          }
      })
  };
  const handleSignup = () => {
    clearErrors();
    fire
      .auth()
      .createUserWithEmailAndPassword(email,password)
      .catch( err => {
        switch(err.code){
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      })
  };

  const handleLogout = () => {
    fire.auth().signOut();
  };

  const authListener = () => {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        clearInputs();
        setUser(user);
      } else {
        setUser("");
      }
    });
  };

  const handleEmailUpdate = () => {
    clearErrors();
    fire
      .auth()
      .currentUser
      .updateEmail(email)
      .catch( err => {
        switch(err.code){
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
        }
      });
    alert("Email updated successfully!")
  };

  const handlePasswordUpdate = () => {
    clearErrors();
    fire
      .auth()
      .currentUser
      .updatePassword(password)
      .catch( err => {
        switch(err.code){
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
        }
      });
    alert("Password updated successfully!")
  };

  useEffect( () => {
    authListener();
  }, []);



  return (
    <div className="App">
        {user ? (
          <div>
          <Hero
            handleLogout={handleLogout}
            handleEmailUpdate={handleEmailUpdate}
            handlePasswordUpdate={handlePasswordUpdate}
            setEmail={setEmail}
            email={email}
            emailError={emailError}
            password={password}
            setPassword={setPassword}
            passwordError={passwordError}
          />
          <TUICalendar
            ref={cal}
            view="month"
            height="0px"
            useCreationPopup={true}
            useDetailPopup={true}
            template={templates}
            onClickSchedule={onClickSchedule}
            onBeforeCreateSchedule={onBeforeCreateSchedule}
            onBeforeDeleteSchedule={onBeforeDeleteSchedule}
            onBeforeUpdateSchedule={onBeforeUpdateSchedule}
            />
          </div>
        ) : (
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleSignup={handleSignup}
            hasAccount={hasAccount}
            setHasAccount={setHasAccount}
            emailError={emailError}
            passwordError={passwordError}
          />
        )}
    </div>
  );
}

export default App;
