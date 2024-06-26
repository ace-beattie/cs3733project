import { useAuth0 } from "@auth0/auth0-react";
import { Link, Redirect } from "wouter";
import { Check, Navigation, ExternalLink, BookUser } from "lucide-react";
import { useEffect, useState } from "react";
import WeatherWidget from "@/components/WeatherWidget.tsx";
import { DateTime } from "luxon";
import CheckInForm from "@/components/CheckInForm.tsx";
import LaserMap from "@/components/LaserMap.tsx";
import { useMe } from "@/components/MeContext";

export default function HomePage() {
  const session = useAuth0();

  const me = useMe();
  const [checkingIn, setCheckingIn] = useState(false);

  const [dateTime, setDateTime] = useState(DateTime.now());

  const [laserFloor, setLaserFloor] = useState<string>("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(DateTime.now());
    }, 1000); // Update time every second

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  const formattedDate = dateTime.toLocaleString(DateTime.DATE_HUGE);
  const formattedTime = dateTime.toLocaleString(DateTime.TIME_SIMPLE);

  if (session.isLoading) {
    return <div></div>;
  }

  if (laserFloor == "") {
    const choices = ["L2", "L1", "1", "2"];
    setLaserFloor(choices[Math.floor(Math.random() * choices.length)]);
  }

  if (me) {
    if (me.role === "patient") {
      return <Redirect to="/portal" />;
    } else {
      return <Redirect to="/pathfind" />;
    }
  }

  return (
    <div className="h-screen min-w-screen flex">
      <div className="flex flex-col h-full justify-center gap-12 items-start w-full px-6">
        {session.isAuthenticated && <Redirect to="/pathfind" />}
        {!checkingIn && (
          <>
            <Link to="/pathfind" asChild>
              <div className="w-full space-y-2 cursor-pointer transition transform origin-left hover:scale-105">
                <Navigation size={75} strokeWidth={1.5} />
                <div className="space-y-1">
                  <p className="text-2xl">Get Directions</p>
                  <p className="text-md text-gray-600">
                    Find your way around BWH
                  </p>
                </div>
              </div>
            </Link>
            <hr className="w-full" />
          </>
        )}
        <div
          onClick={() => {
            setCheckingIn(true);
          }}
          className="w-full cursor-pointer space-y-2 transition transform origin-left hover:scale-105"
        >
          <Check size={75} strokeWidth={1.5} />
          <div className="space-y-1">
            <p className="text-2xl">Check-in</p>
            <p className="text-md text-gray-600">
              Check-in to your appointment
            </p>
          </div>
        </div>
        <hr className="w-full" />
        {!checkingIn && (
          <div
            onClick={(e) => {
              e.preventDefault();
              session.loginWithRedirect().catch((e) => {
                console.error(e);
              });
            }}
            className="w-full cursor-pointer space-y-2 transition transform origin-left hover:scale-105"
          >
            <BookUser size={75} strokeWidth={1.5} />
            <div className="space-y-1">
              <p className="text-2xl">Patient Portal</p>
              <p className="text-md text-gray-600">
                Schedule, cancel, or change upcoming appointments
              </p>
            </div>
          </div>
        )}
        {checkingIn && (
          <div className="w-full">
            <CheckInForm onOpenChange={setCheckingIn} />
          </div>
        )}
        <div
          onClick={() => session.loginWithRedirect()}
          className="flex gap-2 cursor-pointer"
        ></div>
      </div>
      <Link to="/pathfind" asChild>
        <div className="basis-2/3 shrink-0 h-full relative bg-[#001430] cursor-pointer">
          <LaserMap
            // Don't set spawn rate lower than 0.5
            spawnrate={0.5}
            speed={100}
            sameSpeed={true}
            delay={0.4}
            ease={false}
            floor={laserFloor}
          />
          <div className="absolute w-full h-full flex flex-col justify-between items-center px-10 py-8 z-10">
            <div className="flex items-center justify-between w-full">
              <WeatherWidget />
              <div className="text-white">
                <p className="text-xl">
                  {formattedDate} | <b>{formattedTime}</b>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-3 items-center">
                <svg
                  width="40"
                  height="50"
                  viewBox="0 0 29 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.8 15.3999H0V21.8999V27.7999H3.8V15.3999Z"
                    fill="#93C5FD"
                  />
                  <path
                    d="M8.20001 15.3999V21.8999V27.7999H12.1V15.3999H8.20001Z"
                    fill="#93C5FD"
                  />
                  <path
                    d="M16.5 15.3999V21.8999V27.7999H20.3V15.3999H16.5Z"
                    fill="#93C5FD"
                  />
                  <path d="M0 13H14.3H28.6V9.5H0V13Z" fill="#93C5FD" />
                  <path
                    d="M14.3 0L0 4.7V8.4L14.3 3.6L28.6 8.4V4.7L14.3 0Z"
                    fill="#93C5FD"
                  />
                  <path
                    d="M28.6 27.5C28.5 27.7 27.1 30.1 18 30.1H10.6C1.2 30.2 0.2 31.4 0 31.5V35.1C0.2 35 1.2 33.8 10.6 33.7H18C27.1 33.7 28.5 31.3 28.6 31.1V27.5Z"
                    fill="#93C5FD"
                  />
                  <path
                    d="M28.6 33.3999C28.5 33.5999 27.1 35.9999 18 35.9999H10.6C1.2 36.0999 0.2 37.2999 0 37.3999V40.9999C0.2 40.8999 1.2 39.6999 10.6 39.5999H18C27.1 39.5999 28.5 37.1999 28.6 36.9999V33.3999Z"
                    fill="#93C5FD"
                  />
                  <path
                    d="M24.7 15.3999V27.1999C27.8 26.4999 28.5 25.3999 28.5 25.1999V15.3999H24.7Z"
                    fill="#93C5FD"
                  />
                </svg>
                <p className="text-white text-3xl">
                  Brigham and Women's Hospital
                </p>
              </div>
              <div className="space-y-2 justify-center">
                <p className="text-white text-xl text-center px-24">
                  This website is a term project exercise for WPI CS 3733
                  Software Engineering (Prof. Wong) and is not to be confused
                  with the actual Brigham & Women’s Hospital website.{" "}
                </p>
              </div>
            </div>

            <div className="flex flex-row w-full justify-center">
              <div className="flex flex-row gap-x-10 absolute left-0 ml-10">
                <Link to="/about">
                  <p className="ml-auto text-xl text-white hover:scale-105">
                    About Us
                  </p>
                </Link>
                <Link to="/credit">
                  <p className="ml-auto text-xl text-white hover:scale-105">
                    Credits
                  </p>
                </Link>
              </div>
              <div
                className="ml-auto flex gap-2 cursor-pointer hover:scale-105"
                onClick={(e) => {
                  e.preventDefault();
                  session.loginWithRedirect().catch((e) => {
                    console.error(e);
                  });
                }}
              >
                <div className="flex flex-row gap-x-1 right-0">
                  <p className="ml-auto text-xl text-white">Sign In</p>
                  <ExternalLink color="#ffffff" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
