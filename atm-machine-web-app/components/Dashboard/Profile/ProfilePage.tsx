"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageTransition } from "@/hooks/usePageTransition";
import { updateUserProfileAction } from "@/app/actions/user";
import type { User as UserType } from "@/lib/schemas/types";
import styles from "./ProfilePage.module.css";
import { useAppDispatch } from "@/hooks/hooks";
import { setUserId, setDisplayName, setUsername } from "@/lib/features/appSlice";

interface ProfilePageProps {
  userId: string;
  user: UserType;
}

export default function ProfilePage({ user: initialUser }: ProfilePageProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { navigateTo } = usePageTransition();
  const [user, setUser] = useState<UserType>(initialUser);
  const [isEditing, setIsEditing] = useState(false);

  const formatContact = useCallback((contact: number | undefined): string => {
    if (!contact) return "";
    const contactStr = contact.toString();
    if (contactStr.length === 10) {
      return `+1 (${contactStr.slice(0, 3)}) ${contactStr.slice(3, 6)}-${contactStr.slice(6)}`;
    }
    return contactStr;
  }, []);

  const getProfileFromUser = useCallback(() => {
    if (!user) {
      return {
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
        address: "",
      };
    }
    return {
      firstName: user.firstname || "",
      lastName: user.lastname || "",
      email: user.email || "",
      contact: formatContact(user.contact),
      address: user.address || "",
    };
  }, [user, formatContact]);

  const [editedProfile, setEditedProfile] = useState(() => getProfileFromUser());

  const currentProfile = isEditing ? editedProfile : getProfileFromUser();

  const handleEdit = () => {
    setEditedProfile(getProfileFromUser());
    setIsEditing(true);
  };

  const handleSave = async () => {
    const contactNumber = editedProfile.contact.replace(/\D/g, "");
    const contactAsNumber = contactNumber ? parseInt(contactNumber, 10) : user.contact;

    const updateData = {
      firstname: editedProfile.firstName,
      lastname: editedProfile.lastName,
      email: editedProfile.email,
      contact: contactAsNumber,
      address: editedProfile.address,
    };

    const result = await updateUserProfileAction(updateData);

    if (result.success && result.user) {
      setUser(result.user);
      dispatch(setUserId(result.user.id));
      dispatch(setDisplayName(result.user.firstname));
      dispatch(setUsername(result.user.username));
      setIsEditing(false);
      router.refresh();
    } else {
      console.error('Failed to update profile:', result.message);
      alert(result.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedProfile(getProfileFromUser());
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigateTo("/dashboard");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Account Profile</h1>
          <p className={styles.headerDescription}>Manage your personal information</p>
        </div>

        <Button variant="outline" onClick={handleBack} className={styles.backButton}>
          ← Back to Dashboard
        </Button>

        <Card className={styles.profileCard}>
          <CardHeader className={styles.cardHeader}>
            <div className={styles.cardHeaderContent}>
              <div className={styles.headerLeft}>
                <div className={styles.avatar}>
                  <User className={styles.avatarIcon} />
                </div>
                <div className={styles.userInfo}>
                  <CardTitle className={styles.userName}>
                    {currentProfile.firstName} {currentProfile.lastName}
                  </CardTitle>
                  <p className={styles.userRole}>Account Holder</p>
                </div>
              </div>
              {!isEditing ? (
                <Button onClick={handleEdit} className={styles.editButton}>
                  <Edit2 className={styles.buttonIcon} />
                  Edit Profile
                </Button>
              ) : (
                <div className={styles.buttonGroup}>
                  <Button onClick={handleSave} className={styles.saveButton}>
                    <Save className={styles.buttonIcon} />
                    Save
                  </Button>
                  <Button onClick={handleCancel} className={styles.cancelButton}>
                    <X className={styles.buttonIcon} />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className={styles.cardContent}>
            <div className={styles.formContainer}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <Label htmlFor="firstName" className={styles.fieldLabel}>
                    First Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      value={editedProfile.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className={styles.fieldInput}
                    />
                  ) : (
                    <div className={styles.fieldDisplay}>
                      <User className={styles.fieldIcon} />
                      <span className={styles.fieldValue}>{currentProfile.firstName}</span>
                    </div>
                  )}
                </div>

                <div className={styles.field}>
                  <Label htmlFor="lastName" className={styles.fieldLabel}>
                    Last Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={editedProfile.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className={styles.fieldInput}
                    />
                  ) : (
                    <div className={styles.fieldDisplay}>
                      <User className={styles.fieldIcon} />
                      <span className={styles.fieldValue}>{currentProfile.lastName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <Label htmlFor="email" className={styles.fieldLabel}>
                  Email Address
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={styles.fieldInput}
                  />
                ) : (
                  <div className={styles.fieldDisplay}>
                    <Mail className={styles.fieldIcon} />
                    <span className={styles.fieldValue}>{currentProfile.email}</span>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <Label htmlFor="contact" className={styles.fieldLabel}>
                  Contact Number
                </Label>
                {isEditing ? (
                  <Input
                    id="contact"
                    type="tel"
                    value={editedProfile.contact}
                    onChange={(e) => handleChange("contact", e.target.value)}
                    className={styles.fieldInput}
                  />
                ) : (
                  <div className={styles.fieldDisplay}>
                    <Phone className={styles.fieldIcon} />
                    <span className={styles.fieldValue}>{currentProfile.contact}</span>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <Label htmlFor="address" className={styles.fieldLabel}>
                  Address
                </Label>
                {isEditing ? (
                  <Input
                    id="address"
                    value={editedProfile.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className={styles.fieldInput}
                  />
                ) : (
                  <div className={styles.fieldDisplay}>
                    <MapPin className={styles.fieldIcon} />
                    <span className={styles.fieldValue}>{currentProfile.address}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={styles.accountInfoCard}>
          <CardHeader className={styles.accountInfoHeader}>
            <CardTitle className={styles.accountInfoTitle}>Account Information</CardTitle>
          </CardHeader>
          <CardContent className={styles.accountInfoContent}>
            <div className={styles.accountInfoGrid}>
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Account ID</p>
                <p className={styles.infoValue}>{user.accountID || "N/A"}</p>
              </div>
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>User ID</p>
                <p className={styles.infoValue}>{user.id || "N/A"}</p>
              </div>
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Account Status</p>
                <p className={`${styles.infoValue} ${styles.infoValueCapitalize}`}>
                  {user.accountStatus || "N/A"}
                </p>
              </div>
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>Verification</p>
                <p className={styles.infoValue}>{user.verfied ? "Verified ✓" : "Not Verified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
