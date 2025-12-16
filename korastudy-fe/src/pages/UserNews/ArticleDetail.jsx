import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MessageSquare,
  BookmarkPlus,
  Share2,
  Clock,
  Eye,
  Calendar,
  Loader2,
  Book,
  Save,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import newsService from '../../api/newsService';
import azureSpeechService from '../../services/azureSpeechService';
import { useUser } from '../../contexts/UserContext';

/**
 * ArticleDetail - Smart Reading Page
 * Features: HTML content display, audio player, text selection dictionary, reading progress, comments
 */
const ArticleDetail = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const contentRef = useRef(null);

  // Article state
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const audioRef = useRef(null);

  // Text selection & dictionary state
  const [selectedText, setSelectedText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [wordMeaning, setWordMeaning] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reading progress
  const [readingProgress, setReadingProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const startTimeRef = useRef(Date.now());

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  // Level badge configuration
  const levelConfig = {
    BEGINNER: {
      label: 'Beginner',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    INTERMEDIATE: {
      label: 'Intermediate',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    ADVANCED: {
      label: 'Advanced',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
  };

  // Generate audio using Azure Speech if article doesn't have audioUrl
  useEffect(() => {
    if (article && !article.audioUrl && article.content) {
      const generateAudio = async () => {
        setGeneratingAudio(true);
        setAudioError(null);
        try {
          const audioUrl = await azureSpeechService.generateAudioFromArticle(article);
          // Set the audio source
          if (audioRef.current && audioUrl) {
            audioRef.current.src = audioUrl;
          }
        } catch (error) {
          console.error('Failed to generate audio:', error);
          setAudioError('Không thể tạo audio. Vui lòng thử lại sau.');
        } finally {
          setGeneratingAudio(false);
        }
      };
      generateAudio();
    } else if (article && article.audioUrl && audioRef.current) {
      // Use existing audioUrl
      audioRef.current.src = article.audioUrl;
    }
  }, [article]);

  // Fetch article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await newsService.getArticleById(articleId);
        const articleData = response.data?.data || response.data;
        setArticle(articleData);

        // Mark as read in reading history
        if (user) {
          newsService.trackReadingProgress({
            articleId: parseInt(articleId),
            progressPercentage: 0,
            timeSpentSeconds: 0,
            isCompleted: false,
          }).catch(err => console.error('Failed to track reading:', err));
        }
      } catch (err) {
        setError(err.message || 'Failed to load article');
        console.error('Failed to fetch article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId, user]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const scrollTop = window.scrollY;
      const scrollHeight = element.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));

      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      const spent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeSpent(spent);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Save reading progress on unmount
  useEffect(() => {
    return () => {
      if (user && articleId && readingProgress > 0) {
        newsService.trackReadingProgress({
          articleId: parseInt(articleId),
          progressPercentage: Math.round(readingProgress),
          timeSpentSeconds: timeSpent,
          isCompleted: readingProgress >= 95,
        }).catch(err => console.error('Failed to save progress:', err));
      }
    };
  }, [articleId, readingProgress, timeSpent, user]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!articleId) return;

      try {
        setLoadingComments(true);
        const response = await newsService.getArticleComments(articleId, {
          page: 0,
          size: 20,
        });
        const commentsData = response.data?.data?.content || response.data?.content || [];
        setComments(commentsData);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [articleId]);

  // Audio player controls
  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeSpeed = () => {
    if (!audioRef.current) return;
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    audioRef.current.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const skipTime = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Text selection handler
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text.length > 0 && text.length < 100) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelectedText(text);
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
      setShowTooltip(true);
      setWordMeaning(null);
    } else {
      setShowTooltip(false);
      setSelectedText('');
      setWordMeaning(null);
    }
  };

  // Dictionary lookup (demo - replace with real API)
  const lookupWord = async () => {
    if (!selectedText) return;

    setLookingUp(true);
    try {
      // Demo dictionary response - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const demoMeanings = {
        'artificial': 'nhân tạo, giả tạo',
        'intelligence': 'trí thông minh, trí tuệ',
        'technology': 'công nghệ, kỹ thuật',
        'innovation': 'sự đổi mới, cải tiến',
        'transform': 'chuyển đổi, biến đổi',
      };

      const meaning = demoMeanings[selectedText.toLowerCase()] || 
        `Meaning of "${selectedText}" (Demo dictionary - integrate real API here)`;

      setWordMeaning(meaning);
    } catch (err) {
      console.error('Failed to lookup word:', err);
      setWordMeaning('Failed to lookup word');
    } finally {
      setLookingUp(false);
    }
  };

  // Save word to vocabulary
  const saveWord = async () => {
    if (!selectedText || !user) return;

    setSaving(true);
    try {
      // Call API to save word - implement based on your API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // You can implement this API call:
      // await newsService.saveWord({
      //   word: selectedText,
      //   meaning: wordMeaning || '',
      //   articleId: parseInt(articleId),
      // });

      alert(`Saved word: "${selectedText}" to your vocabulary!`);
      setShowTooltip(false);
    } catch (err) {
      console.error('Failed to save word:', err);
      alert('Failed to save word');
    } finally {
      setSaving(false);
    }
  };

  // Setup text selection listener
  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(handleTextSelection, 10);
    };

    const handleClickOutside = (e) => {
      const tooltipElement = document.querySelector('.tooltip-container');
      if (showTooltip && tooltipElement && !tooltipElement.contains(e.target)) {
        setShowTooltip(false);
        setSelectedText('');
        setWordMeaning(null);
        window.getSelection()?.removeAllRanges();
      }
    };

    // Add listeners to document
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  // Comment handlers
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    try {
      await newsService.createComment({
        articleId: parseInt(articleId),
        content: commentText,
        parentCommentId: null,
      });

      setCommentText('');
      
      // Refresh comments
      const response = await newsService.getArticleComments(articleId, {
        page: 0,
        size: 20,
      });
      const commentsData = response.data?.data?.content || response.data?.content || [];
      setComments(commentsData);
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="mb-4 text-red-600 dark:text-red-400">{error || 'Article not found'}</p>
          <button
            onClick={() => navigate('/news')}
            className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Back to News Feed
          </button>
        </div>
      </div>
    );
  }

  const level = levelConfig[article.level] || levelConfig.BEGINNER;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Reading Progress Bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Text Selection Tooltip */}
      {showTooltip && (
        <div
          className="tooltip-container fixed z-50"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 font-semibold text-gray-900 dark:text-white">
              "{selectedText}"
            </div>

            {wordMeaning && (
              <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                {wordMeaning}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={lookupWord}
                disabled={lookingUp}
                className="flex items-center gap-1 rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
              >
                <Book size={16} />
                {lookingUp ? 'Looking up...' : 'Dictionary'}
              </button>

              {user && (
                <button
                  onClick={saveWord}
                  disabled={saving}
                  className="flex items-center gap-1 rounded-md bg-green-500 px-3 py-1.5 text-sm text-white hover:bg-green-600 disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Word'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={() => navigate('/news')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to News</span>
            </button>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Bookmark */}
              <button className="rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">
                <BookmarkPlus size={20} />
              </button>

              {/* Share */}
              <button className="rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Audio Player */}
      {(article?.audioUrl || generatingAudio || audioRef.current?.src) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="container mx-auto px-4 py-3">
            {generatingAudio ? (
              <div className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <span>Generating audio from article...</span>
              </div>
            ) : audioError ? (
              <div className="flex items-center justify-center gap-2 text-red-500">
                <span>{audioError}</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={toggleAudio}
                className="rounded-full bg-blue-500 p-3 text-white hover:bg-blue-600"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              {/* Skip Backward */}
              <button
                onClick={() => skipTime(-10)}
                className="rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              >
                <SkipBack size={18} />
              </button>

              {/* Progress Bar */}
              <div className="flex-1">
                <div
                  onClick={handleSeek}
                  className="group relative h-2 cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700"
                >
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Skip Forward */}
              <button
                onClick={() => skipTime(10)}
                className="rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              >
                <SkipForward size={18} />
              </button>

              {/* Speed Control */}
              <button
                onClick={changeSpeed}
                className="min-w-[60px] rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              >
                {playbackSpeed}x
              </button>

              {/* Mute */}
              <button
                onClick={toggleMute}
                className="rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Article Header */}
          <div className="mb-8">
            {/* Level Badge */}
            <div className="mb-4">
              <span className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${level.className}`}>
                {level.label}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{Math.ceil(timeSpent / 60)} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{article.readCount || 0} views</span>
              </div>
            </div>

            {/* Source URL */}
            {article.sourceUrl && (
              <div className="mt-4">
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Original Source →
                </a>
              </div>
            )}
          </div>

          {/* Article Content */}
          <div
            ref={contentRef}
            className="prose prose-lg prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg dark:prose-a:text-blue-400"
            dangerouslySetInnerHTML={{ __html: article.htmlContent }}
          />

          {/* Comments Section */}
          <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
            <div className="mb-6 flex items-center gap-2">
              <MessageSquare size={24} className="text-gray-700 dark:text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Comments ({comments.length})
              </h2>
            </div>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-8 rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20">
                <p className="text-gray-700 dark:text-gray-300">
                  Please{' '}
                  <button
                    onClick={() => navigate('/dang-nhap')}
                    className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    login
                  </button>{' '}
                  to comment
                </p>
              </div>
            )}

            {/* Comments List */}
            {loadingComments ? (
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {comment.user?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {comment.user?.username || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
