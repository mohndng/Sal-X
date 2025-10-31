import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile } from '../types';
import ConfirmationDialog from './ConfirmationDialog';

interface UserProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ isOpen, onClose, userProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(userProfile);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  useEffect(() => {
    // When the profile page is opened or the base userProfile prop changes,
    // reset the form to match the source of truth.
    setEditedProfile(userProfile);
    // If we switch back to view mode, exit editing state.
    if (!isEditing) {
      setIsEditing(false);
    }
  }, [userProfile, isOpen]);
  
  const isDirty = useMemo(() => {
    return JSON.stringify(editedProfile) !== JSON.stringify(userProfile);
  }, [editedProfile, userProfile]);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // For radio buttons, the value is always a string.
    // For the salary input, we want to convert the value to a number.
    const isNumericInput = type === 'number';
    const finalValue = isNumericInput ? parseFloat(value) || 0 : value;

    setEditedProfile(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'profilePictureUrl' | 'coverPhotoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile(prev => ({ ...prev, [imageType]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (imageType: 'profilePictureUrl' | 'coverPhotoUrl') => {
    setEditedProfile(prev => ({ ...prev, [imageType]: null }));
  };

  const handleSave = () => {
    const trimmedBio = editedProfile.bio.split(/\s+/).slice(0, 100).join(' ');
    const finalProfile = { ...editedProfile, bio: trimmedBio };
    onSave(finalProfile);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
    setIsCancelConfirmOpen(false);
  };
  
  const handleAttemptCancel = () => {
    if (isDirty) {
      setIsCancelConfirmOpen(true);
    } else {
      handleCancel();
    }
  };

  const bioWordCount = editedProfile.bio.split(/\s+/).filter(Boolean).length;

  return (
    <>
      <ConfirmationDialog
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleCancel}
        title="Discard Changes?"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmButtonText="Discard"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
      />
      <div className="fixed inset-0 z-50 bg-gray-900/50 dark:bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl animate-slide-in-right overflow-y-auto">
          <button onClick={onClose} className="absolute top-4 right-4 z-20 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Close profile" title="Close">
            <i className="fas fa-times fa-2x"></i>
          </button>
          
          <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
            {editedProfile.coverPhotoUrl && (
              <img src={editedProfile.coverPhotoUrl} alt="Cover" className="w-full h-full object-cover" />
            )}
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity">
                  <label htmlFor="cover-photo-upload" className="cursor-pointer p-4" title="Upload new cover photo">
                    <i className="fas fa-camera fa-2x"></i>
                  </label>
                  {editedProfile.coverPhotoUrl && (
                    <button onClick={() => removeImage('coverPhotoUrl')} className="p-4" title="Remove cover photo">
                      <i className="fas fa-trash-alt fa-lg"></i>
                    </button>
                  )}
                  <input id="cover-photo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'coverPhotoUrl')} />
              </div>
            )}
          </div>
          
          <div className="p-6 relative">
            <div className="absolute -top-16 left-6 h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-600 overflow-hidden shadow-lg">
              {editedProfile.profilePictureUrl ? (
                <img src={editedProfile.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <i className="fas fa-user fa-4x"></i>
                  </div>
              )}
              {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity">
                    <label htmlFor="profile-photo-upload" className="cursor-pointer p-2" title="Upload new profile picture">
                      <i className="fas fa-camera"></i>
                    </label>
                    {editedProfile.profilePictureUrl && (
                      <button onClick={() => removeImage('profilePictureUrl')} className="p-2" title="Remove profile picture">
                        <i className="fas fa-trash-alt fa-sm"></i>
                      </button>
                    )}
                    <input id="profile-photo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'profilePictureUrl')} />
                </div>
              )}
            </div>
            
            <div className="pt-16">
              {isEditing ? (
                <div>
                  <button onClick={handleAttemptCancel} className="flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-bold mb-4 py-2 px-4 rounded-lg bg-green-100 dark:bg-green-900/50 transition-colors duration-300 ease-in-out">
                    <i className="fas fa-arrow-left mr-2"></i> Go Back
                  </button>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name / Nickname</label>
                      <input type="text" name="name" id="name" value={editedProfile.name} onChange={handleInputChange} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Bio</label>
                        <textarea name="bio" id="bio" value={editedProfile.bio} onChange={handleInputChange} rows={4} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none"></textarea>
                        <p className={`text-xs text-right mt-1 ${bioWordCount > 100 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>{bioWordCount} / 100 words</p>
                    </div>
                    <div>
                      <label htmlFor="natureOfWork" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Nature of Work</label>
                      <select name="natureOfWork" id="natureOfWork" value={editedProfile.natureOfWork} onChange={handleInputChange} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none">
                        <option value="">Select...</option>
                        <option value="employed">Employed</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="student">Student</option>
                        <option value="unemployed">Unemployed</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="salary" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Salary</label>
                      <div className="flex items-center gap-2">
                        <input type="number" name="salary" id="salary" value={editedProfile.salary} onChange={handleInputChange} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" />
                        <div className="flex items-center">
                          <input type="radio" id="weekly" name="salaryFrequency" value="weekly" checked={editedProfile.salaryFrequency === 'weekly'} onChange={handleInputChange} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                          <label htmlFor="weekly" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Weekly</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="monthly" name="salaryFrequency" value="monthly" checked={editedProfile.salaryFrequency === 'monthly'} onChange={handleInputChange} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                          <label htmlFor="monthly" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Monthly</label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <button onClick={handleAttemptCancel} className="px-4 py-2 rounded-md font-semibold bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white transition-colors">Cancel</button>
                      <button onClick={handleSave} disabled={!isDirty} className="px-4 py-2 rounded-md font-semibold text-white transition-colors bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed">Save Changes</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-end">
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-md font-semibold bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors">
                      <i className="fas fa-pencil-alt mr-2"></i>Edit Profile
                    </button>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">{userProfile.name}</h2>
                  <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-300">
                      <div>
                          <h4 className="font-semibold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Bio</h4>
                          <p className="whitespace-pre-wrap">{userProfile.bio || <span className="text-gray-400 italic">No bio provided.</span>}</p>
                      </div>
                      <div>
                          <h4 className="font-semibold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Nature of Work</h4>
                          <p>{userProfile.natureOfWork || <span className="text-gray-400 italic">Not specified.</span>}</p>
                      </div>
                      <div>
                          <h4 className="font-semibold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Salary</h4>
                          <p>{userProfile.salary > 0 ? `$${userProfile.salary.toLocaleString()} ${userProfile.salaryFrequency}` : <span className="text-gray-400 italic">Not specified.</span>}</p>
                      </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
          @keyframes slide-in-right {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
};

export default UserProfilePage;