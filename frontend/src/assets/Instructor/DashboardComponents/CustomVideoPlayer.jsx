/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipForward,
  SkipBack,
  Settings,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Loader from "../../Utils/Loader";
import {
  fetchCourseDetails,
  fetchCourseVideos,
} from "../Services/CourseManagement";
import DashboardLayout from "../Components/InstructorDashboard/DashboardLayout";

// Format seconds to hours:minutes:seconds
// Format seconds to hours:minutes:seconds
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60); // Add Math.floor here

  return [
    hours > 0 ? hours : null,
    minutes.toString().padStart(2, "0"),
    remainingSeconds.toString().padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":");
};

const CustomVideoPlayer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  // Fetch course details and videos on component mount
  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);
        const [courseData, videosData] = await Promise.all([
          fetchCourseDetails(courseId),
          fetchCourseVideos(courseId),
        ]);

        setCourse(courseData);
        setVideos(videosData.videos || []);

        // Set the initial video
        if (videosData.videos && videosData.videos.length > 0) {
          setCurrentVideo(videosData.videos[0]);
        }
      } catch (err) {
        setError(err.message || "Failed to load course data");
        console.error("Error loading course data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  // Handle video selection
  const handleSelectVideo = (video, index) => {
    setCurrentVideo(video);
    setSelectedVideoIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);

    // Reset player state
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  // Video Player Controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    // Auto-play next video if available
    if (selectedVideoIndex < videos.length - 1) {
      const nextIndex = selectedVideoIndex + 1;
      handleSelectVideo(videos[nextIndex], nextIndex);
    }
  };

  const handleFullscreen = () => {
    if (playerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerRef.current.requestFullscreen();
      }
    }
  };

  const nextVideo = () => {
    if (selectedVideoIndex < videos.length - 1) {
      const nextIndex = selectedVideoIndex + 1;
      handleSelectVideo(videos[nextIndex], nextIndex);
    }
  };

  const previousVideo = () => {
    if (selectedVideoIndex > 0) {
      const prevIndex = selectedVideoIndex - 1;
      handleSelectVideo(videos[prevIndex], prevIndex);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 max-w-lg w-full">
          <h2 className="text-lg font-medium mb-2">Error Loading Course</h2>
          <p>{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!course || videos.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-lg w-full">
          <h2 className="text-lg font-medium mb-2">No Content Available</h2>
          <p>This course doesn't have any videos available yet.</p>
          <button
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            onClick={handleGoBack}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center mb-6">
            <button
              onClick={handleGoBack}
              className="mr-3 p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-medium text-gray-900">
              {course.title}
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video Player Section */}
            <div className="lg:w-8/12 w-full">
              <div
                className="bg-black rounded-lg overflow-hidden border border-gray-200"
                ref={playerRef}
              >
                {currentVideo ? (
                  <div className="relative">
                    {/* Video Element */}
                    <video
                      ref={videoRef}
                      src={currentVideo.videoUrl}
                      className="w-full aspect-video"
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={handleVideoEnded}
                      onClick={togglePlay}
                    />

                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      {/* Progress Bar */}
                      {/* Progress Bar */}
                      <div className="flex items-center mb-3 group">
                        <span className="text-xs mr-2">
                          {formatDuration(currentTime)}
                        </span>
                        <div className="relative w-full h-1 bg-gray-700 rounded-full">
                          <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            className="absolute top-0 left-0 w-full h-1 appearance-none cursor-pointer z-10 opacity-0"
                          />
                          <div
                            className="h-1 bg-blue-500 rounded-full"
                            style={{
                              width: `${
                                (currentTime / (duration || 1)) * 100
                              }%`,
                            }}
                          ></div>
                          <div
                            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                            style={{
                              left: `${(currentTime / (duration || 1)) * 100}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          ></div>
                        </div>
                        <span className="text-xs ml-2">
                          {formatDuration(duration)}
                        </span>
                      </div>

                      {/* Player Controls */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={previousVideo}
                            disabled={selectedVideoIndex === 0}
                          >
                            <SkipBack
                              size={18}
                              className={
                                selectedVideoIndex === 0
                                  ? "text-gray-500"
                                  : "text-white"
                              }
                            />
                          </button>

                          <button
                            onClick={togglePlay}
                            className="hover:text-gray-300"
                          >
                            {isPlaying ? (
                              <Pause size={20} />
                            ) : (
                              <Play size={20} />
                            )}
                          </button>

                          <button
                            onClick={nextVideo}
                            disabled={selectedVideoIndex === videos.length - 1}
                          >
                            <SkipForward
                              size={18}
                              className={
                                selectedVideoIndex === videos.length - 1
                                  ? "text-gray-500"
                                  : "text-white"
                              }
                            />
                          </button>

                          <div className="flex items-center">
                            <button onClick={toggleMute} className="mr-2">
                              {isMuted ? (
                                <VolumeX size={18} />
                              ) : (
                                <Volume2 size={18} />
                              )}
                            </button>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={volume}
                              onChange={handleVolumeChange}
                              className="w-16 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <button>
                            <Settings size={18} className="text-gray-200" />
                          </button>
                          <button onClick={handleFullscreen}>
                            <Maximize size={18} className="text-gray-200" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-100 text-gray-400">
                    <p>Select a video to play</p>
                  </div>
                )}
              </div>

              {/* Video Info */}
              {currentVideo && (
                <div className="bg-white p-4 mt-4 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    {currentVideo.title}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {currentVideo.description}
                  </p>
                </div>
              )}
            </div>

            {/* Video List Section */}
            <div className="lg:w-4/12 w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-3 bg-gray-100 text-gray-900 border-b border-gray-200">
                <h3 className="font-medium">Course Videos ({videos.length})</h3>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {videos.map((video, index) => (
                  <div
                    key={video._id}
                    className={`flex p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                      selectedVideoIndex === index ? "bg-gray-50" : ""
                    }`}
                    onClick={() => handleSelectVideo(video, index)}
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-16 flex-shrink-0 relative mr-3">
                      {video.videoThumbnail ? (
                        <img
                          src={video.videoThumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                          <Play size={16} className="text-gray-400" />
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/70 px-1 rounded text-xs text-white">
                        {formatDuration(video.duration)}
                      </div>
                    </div>

                    {/* Video info */}
                    <div className="flex-1">
                      <h4
                        className={`text-sm font-medium ${
                          selectedVideoIndex === index
                            ? "text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                        {video.description}
                      </p>
                    </div>

                    {selectedVideoIndex === index && (
                      <div className="flex items-center ml-2">
                        <ChevronRight size={16} className="text-gray-900" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomVideoPlayer;
