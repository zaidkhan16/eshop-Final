import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);  
   
  return (
    <div className="py-8">
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider">
                ⚡ Flash Sale Events
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Popular Ongoing Events
              </h2>
            </div>
          </div>

          <div className="w-full">
            {allEvents && allEvents.length !== 0 ? (
              <EventCard data={allEvents[0]} />
            ) : (
              <div className="w-full p-8 text-center bg-slate-50 border border-slate-100 rounded-3xl text-slate-500 font-medium">
                No active event sales at the moment. Check back soon!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;