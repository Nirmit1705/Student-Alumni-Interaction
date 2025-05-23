import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Users, Video, Clock, ChevronRight } from "lucide-react";

const UpcomingSessionsSection = () => {
  const navigate = useNavigate();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/mentorship/sessions/my-upcoming`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data && Array.isArray(response.data)) {
          // Transform data for display
          const transformedSessions = response.data.map(session => ({
            id: session._id,
            title: session.title || "Mentorship Session",
            mentor: session.mentorName || "Your Mentor",
            description: session.description || "Discussion with mentor",
            date: new Date(session.date),
            time: session.time || "TBD",
            endTime: session.endTime,
            duration: session.duration || 30,
            type: session.groupSession ? "Group Workshop" : "One-on-One",
            location: session.location || "Virtual",
            meetingLink: session.meetingLink || null,
            status: session.status || "upcoming"
          }));

          // Sort by date (closest first)
          transformedSessions.sort((a, b) => a.date - b.date);
          
          setUpcomingSessions(transformedSessions);
        } else {
          setUpcomingSessions([]);
        }
      } catch (error) {
        console.error("Error fetching upcoming sessions:", error);
        setError("Failed to load upcoming sessions");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUpcomingSessions();
  }, [navigate]);

  // Function to determine how far away a session is
  const getTimeUntil = (date) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffTime = Math.abs(sessionDate - now);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else if (diffDays < 7) {
      return `${diffDays} days`;
    } else {
      return `${Math.floor(diffDays / 7)} weeks`;
    }
  };

  // Navigate to full schedule
  const viewSchedule = () => {
    navigate("/sessions");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 animate-fade-in h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-lg">Upcoming Sessions</h3>
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="glass-card rounded-xl p-6 animate-fade-in h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-lg">Upcoming Sessions</h3>
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div className="text-center py-4">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            className="text-primary hover:underline"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (upcomingSessions.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 animate-fade-in h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-lg">Upcoming Sessions</h3>
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div className="text-center py-8">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">No Upcoming Sessions</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            You don't have any sessions scheduled yet.
          </p>
          <button 
            onClick={() => navigate("/find-mentors")}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
          >
            Find a Mentor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-lg">Upcoming Sessions</h3>
        <Calendar className="h-5 w-5 text-primary" />
      </div>
      
      <div className="space-y-4">
        {upcomingSessions.slice(0, 3).map((session) => (
          <div key={session.id} className="border border-border/30 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{session.title}</h4>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {getTimeUntil(session.date)}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              {session.type === "Group Workshop" ? (
                <Users className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <Video className="h-3.5 w-3.5 mr-1.5" />
              )}
              <span>{session.type} with {session.mentor}</span>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>{session.date.toLocaleDateString()} • </span>
              <Clock className="h-3.5 w-3.5 mx-1.5" />
              <span>{session.time} ({session.duration} min)</span>
            </div>
            
            {session.meetingLink && (
              <a 
                href={session.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-xs text-primary flex items-center hover:underline"
              >
                <Video className="h-3.5 w-3.5 mr-1.5" />
                Join Meeting
              </a>
            )}
          </div>
        ))}
      </div>
      
      <button 
        className="w-full mt-4 text-sm text-primary font-medium flex items-center justify-center"
        onClick={viewSchedule}
      >
        View full schedule
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
};

export default UpcomingSessionsSection;