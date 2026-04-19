import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';

const Avatar = ({
  source,
  name,
  size = 'medium',
  shape = 'circle', // 'circle', 'rounded', 'square'
  borderColor,
  borderWidth = 2,
  backgroundColor,
  textColor = 'white',
  icon,
  iconColor,
  iconSize,
  showBadge = false,
  badgeStatus,
  badgePosition = 'bottom-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  onPress,
  style,
  imageStyle,
}) => {
  
  const getSizeValue = () => {
    switch(size) {
      case 'xsmall':
        return 24;
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 64;
      case 'xlarge':
        return 80;
      default:
        return 48;
    }
  };

  const getIconSize = () => {
    if (iconSize) return iconSize;
    switch(size) {
      case 'xsmall':
        return 12;
      case 'small':
        return 16;
      case 'medium':
        return 24;
      case 'large':
        return 32;
      case 'xlarge':
        return 40;
      default:
        return 24;
    }
  };

  const getFontSize = () => {
    switch(size) {
      case 'xsmall':
        return 10;
      case 'small':
        return 14;
      case 'medium':
        return 20;
      case 'large':
        return 28;
      case 'xlarge':
        return 36;
      default:
        return 20;
    }
  };

  const getBorderRadius = () => {
    const avatarSize = getSizeValue();
    switch(shape) {
      case 'circle':
        return avatarSize / 2;
      case 'rounded':
        return 8;
      case 'square':
        return 0;
      default:
        return avatarSize / 2;
    }
  };

  const getBadgePosition = () => {
    const avatarSize = getSizeValue();
    const badgeSize = size === 'xsmall' ? 8 : size === 'small' ? 10 : 12;
    const offset = badgeSize / 2;

    switch(badgePosition) {
      case 'top-right':
        return { top: -offset, right: -offset };
      case 'top-left':
        return { top: -offset, left: -offset };
      case 'bottom-left':
        return { bottom: -offset, left: -offset };
      case 'bottom-right':
      default:
        return { bottom: -offset, right: -offset };
    }
  };

  const getBadgeColor = () => {
    switch(badgeStatus) {
      case 'online':
        return colors.successGreen;
      case 'offline':
        return colors.textTertiary;
      case 'away':
        return colors.warningYellow;
      case 'busy':
        return colors.alertRed;
      default:
        return colors.successGreen;
    }
  };

  const getInitials = () => {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    if (name) {
      // Generate consistent color based on name
      const colors = [
        '#FF6B6B', '#4A90E2', '#FF8C42', '#9B6B9E', '#4CAF50', 
        '#FF4D6D', '#5E4B8C', '#FFB347', '#66BB6A', '#FF9933'
      ];
      const index = name.length % colors.length;
      return colors[index];
    }
    return colors.primarySaffron;
  };

  const avatarSize = getSizeValue();
  const borderRadius = getBorderRadius();
  const badgePositionStyle = getBadgePosition();

  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius,
            },
            imageStyle,
          ]}
        />
      );
    }

    if (icon) {
      return (
        <Ionicons
          name={icon}
          size={getIconSize()}
          color={iconColor || textColor}
        />
      );
    }

    if (name) {
      return (
        <Text style={[styles.initials, { fontSize: getFontSize(), color: textColor }]}>
          {getInitials()}
        </Text>
      );
    }

    return (
      <Ionicons
        name="person"
        size={getIconSize()}
        color={iconColor || textColor}
      />
    );
  };

  const avatarContent = (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius,
          backgroundColor: getBackgroundColor(),
          borderWidth: borderWidth,
          borderColor: borderColor || 'transparent',
        },
        style,
      ]}
    >
      {renderContent()}

      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              width: size === 'xsmall' ? 8 : size === 'small' ? 10 : 12,
              height: size === 'xsmall' ? 8 : size === 'small' ? 10 : 12,
              borderRadius: (size === 'xsmall' ? 8 : size === 'small' ? 10 : 12) / 2,
              backgroundColor: getBadgeColor(),
              borderWidth: 2,
              borderColor: 'white',
              ...badgePositionStyle,
            },
          ]}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {avatarContent}
      </TouchableOpacity>
    );
  }

  return avatarContent;
};

export const AvatarGroup = ({
  users,
  max = 4,
  size = 'medium',
  shape = 'circle',
  spacing = -8,
  onPress,
  style,
}) => {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <View style={[styles.groupContainer, style]}>
      {displayUsers.map((user, index) => (
        <View
          key={index}
          style={[
            styles.groupItem,
            { marginLeft: index === 0 ? 0 : spacing },
          ]}
        >
          <Avatar
            source={user.source}
            name={user.name}
            size={size}
            shape={shape}
            showBadge={user.showBadge}
            badgeStatus={user.badgeStatus}
          />
        </View>
      ))}
      {remainingCount > 0 && (
        <View style={[styles.groupItem, { marginLeft: spacing }]}>
          <Avatar
            name={`+${remainingCount}`}
            size={size}
            shape={shape}
            backgroundColor={colors.textSecondary}
          />
        </View>
      )}
    </View>
  );
};

export const ProfileAvatar = ({ source, name, onEditPress, ...props }) => (
  <View style={styles.profileContainer}>
    <Avatar source={source} name={name} size="xlarge" {...props} />
    {onEditPress && (
      <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
        <Ionicons name="camera" size={16} color="white" />
      </TouchableOpacity>
    )}
  </View>
);

export const StoryAvatar = ({
  source,
  name,
  seen = false,
  onPress,
  showAdd = false,
}) => {
  const gradientColors = seen 
    ? ['#C0C0C0', '#A0A0A0']
    : [colors.primarySaffron, colors.primaryGreen];

  return (
    <TouchableOpacity style={styles.storyContainer} onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.storyGradient}
      >
        <View style={styles.storyAvatarContainer}>
          <Avatar
            source={source}
            name={name}
            size="medium"
            borderWidth={2}
            borderColor="white"
          />
          {showAdd && (
            <View style={styles.storyAddButton}>
              <Ionicons name="add" size={12} color="white" />
            </View>
          )}
        </View>
      </LinearGradient>
      {name && <Text style={styles.storyName}>{name}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    fontFamily: 'Inter-SemiBold',
    includeFontPadding: false,
  },
  badge: {
    position: 'absolute',
    zIndex: 1,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupItem: {
    borderRadius: 100,
    backgroundColor: 'white',
  },
  profileContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySaffron,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  storyGradient: {
    padding: 2,
    borderRadius: 60,
  },
  storyAvatarContainer: {
    position: 'relative',
  },
  storyAddButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primarySaffron,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  storyName: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default Avatar;