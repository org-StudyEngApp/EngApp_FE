import React from 'react';
import NavBar from '../components/NavBar';
import ProfileContainer from '../containers/ProfileContainer';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfileOverview from '../components/profile/ProfileOverview';
import ProfileHistory from '../components/profile/ProfileHistory';
import ProfileAchievements from '../components/profile/ProfileAchievements';
import ProfileSettings from '../components/profile/ProfileSettings';
import ConfirmationModal from '../components/profile/ConfirmationModal';

const Profile = () => {
  return (
    <ProfileContainer>
      {(profileUtils) => {
        const { user, activeTab } = profileUtils;

        if (!user) {
          return (
            <>
              <NavBar />
              <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Vui lòng đăng nhập
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Bạn cần đăng nhập để xem trang hồ sơ cá nhân
                  </p>
                </div>
              </div>
            </>
          );
        }

        return (
          <>
            
            <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <ProfileHeader {...profileUtils} />

                {/* Tabs */}
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm mb-8">
                  <ProfileTabs activeTab={activeTab} handleTabChange={profileUtils.handleTabChange} />

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'overview' && <ProfileOverview {...profileUtils} />}
                    {activeTab === 'history' && <ProfileHistory {...profileUtils} />}
                    {activeTab === 'achievements' && <ProfileAchievements {...profileUtils} />}
                    {activeTab === 'settings' && <ProfileSettings {...profileUtils} />}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Confirmation Modal */}
            <ConfirmationModal 
              showConfirmModal={profileUtils.showConfirmModal}
              setShowConfirmModal={profileUtils.setShowConfirmModal}
              handleConfirmSave={profileUtils.handleConfirmSave}
            />
          </>
        );
      }}
    </ProfileContainer>
  );
};

export default Profile;