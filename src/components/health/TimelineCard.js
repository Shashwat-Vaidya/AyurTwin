import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import colors from '../../utils/constants/colors';
import Card from '../common/Card';
import { formatRelativeTime } from '../../utils/helpers/dateHelper';

const TimelineCard = ({
  events = [],
  onEventPress,
  showDateHeaders = true,
  maxEvents,
  emptyMessage = "No events to display",
  style,
}) => {
  
  const groupEventsByDate = () => {
    const grouped = {};
    events.forEach(event => {
      const date = new Date(event.timestamp).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();
  const dates = Object.keys(groupedEvents).sort((a, b) => new Date(b) - new Date(a));

  const getEventIcon = (type) => {
    switch(type) {
      case 'health_alert': return 'alert-circle';
      case 'goal': return 'trophy';
      case 'achievement': return 'star';
      case 'measurement': return 'fitness';
      case 'medication': return 'medkit';
      case 'appointment': return 'calendar';
      case 'note': return 'document-text';
      default: return 'time';
    }
  };

  const getEventColor = (type) => {
    switch(type) {
      case 'health_alert': return colors.alertRed;
      case 'goal': return colors.successGreen;
      case 'achievement': return colors.warningYellow;
      case 'measurement': return colors.spO2Blue;
      case 'medication': return colors.primarySaffron;
      case 'appointment': return colors.stressPurple;
      case 'note': return colors.textSecondary;
      default: return colors.primarySaffron;
    }
  };

  const renderEvent = (event, index) => {
    const eventColor = getEventColor(event.type);
    const eventIcon = getEventIcon(event.type);
    const time = new Date(event.timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return (
      <TouchableOpacity
        key={index}
        style={styles.eventItem}
        onPress={() => onEventPress?.(event)}
        activeOpacity={0.7}
      >
        <View style={styles.eventTimeContainer}>
          <Text style={styles.eventTime}>{time}</Text>
          {index === 0 && <View style={[styles.eventDot, { backgroundColor: eventColor }]} />}
        </View>

        <View style={[styles.eventContent, { borderLeftColor: eventColor }]}>
          <View style={styles.eventHeader}>
            <View style={[styles.eventIconContainer, { backgroundColor: `${eventColor}20` }]}>
              <Ionicons name={eventIcon} size={16} color={eventColor} />
            </View>
            <View style={styles.eventTitleContainer}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              {event.subtitle && (
                <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
              )}
            </View>
          </View>

          {event.description && (
            <Text style={styles.eventDescription}>{event.description}</Text>
          )}

          {event.metadata && (
            <View style={styles.eventMetadata}>
              {Object.entries(event.metadata).map(([key, value], idx) => (
                <View key={idx} style={styles.metadataItem}>
                  <Text style={styles.metadataLabel}>{key}:</Text>
                  <Text style={styles.metadataValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          {event.value && (
            <View style={styles.eventValue}>
              <Text style={styles.eventValueText}>{event.value}</Text>
              {event.unit && <Text style={styles.eventUnit}>{event.unit}</Text>}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const displayDates = maxEvents ? dates.slice(0, maxEvents) : dates;

  return (
    <Card style={[styles.container, style]}>
      <Text style={styles.title}>Timeline</Text>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={40} color={colors.textTertiary} />
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {displayDates.map((date, dateIndex) => (
            <View key={dateIndex}>
              {showDateHeaders && (
                <View style={styles.dateHeader}>
                  <Text style={styles.dateText}>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateBadgeText}>
                      {groupedEvents[date].length} events
                    </Text>
                  </View>
                </View>
              )}

              {groupedEvents[date].map((event, index) => renderEvent(event, index))}
            </View>
          ))}

          {maxEvents && events.length > maxEvents && (
            <TouchableOpacity style={styles.viewMoreButton}>
              <Text style={styles.viewMoreText}>View More</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primarySaffron} />
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </Card>
  );
};

export const HealthTimeline = ({ data, onEventPress }) => {
  const events = [
    {
      type: 'measurement',
      title: 'Heart Rate Reading',
      description: 'Resting heart rate measured',
      value: '72 bpm',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      metadata: { zone: 'Normal' },
    },
    {
      type: 'goal',
      title: 'Steps Goal Achieved',
      description: 'Reached 10,000 steps',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      type: 'health_alert',
      title: 'Stress Alert',
      description: 'Elevated stress levels detected',
      value: 'High',
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
      type: 'achievement',
      title: '7-Day Streak',
      description: 'Maintained health tracking for 7 days',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
    {
      type: 'medication',
      title: 'Medication Reminder',
      description: 'Time to take evening medication',
      timestamp: new Date(Date.now() - 26 * 3600000).toISOString(),
    },
  ];

  return (
    <TimelineCard
      events={events}
      onEventPress={onEventPress}
      emptyMessage="No health events recorded"
    />
  );
};

export const ActivityTimeline = ({ activities, onActivityPress }) => {
  const events = activities?.map(activity => ({
    type: 'measurement',
    title: activity.type,
    description: activity.description,
    value: `${activity.value} ${activity.unit}`,
    timestamp: activity.timestamp,
    metadata: activity.metadata,
  })) || [];

  return (
    <TimelineCard
      events={events}
      onEventPress={onActivityPress}
      maxEvents={10}
    />
  );
};

export const MedicationTimeline = ({ medications, onMedicationPress }) => {
  const getMedicationStatus = (medication) => {
    const now = new Date();
    const medTime = new Date(medication.time);
    
    if (medication.taken) {
      return { label: 'Taken', color: colors.successGreen };
    } else if (medTime < now) {
      return { label: 'Missed', color: colors.alertRed };
    } else {
      return { label: 'Upcoming', color: colors.warningYellow };
    }
  };

  const events = medications?.map(med => {
    const status = getMedicationStatus(med);
    return {
      type: 'medication',
      title: med.name,
      description: `${med.dosage} - ${status.label}`,
      timestamp: med.time,
      metadata: {
        dosage: med.dosage,
        status: status.label,
      },
    };
  }) || [];

  return (
    <TimelineCard
      events={events}
      onEventPress={onMedicationPress}
      showDateHeaders={false}
    />
  );
};

export const AppointmentTimeline = ({ appointments, onAppointmentPress }) => {
  const events = appointments?.map(app => ({
    type: 'appointment',
    title: app.title,
    description: app.doctor,
    timestamp: app.datetime,
    metadata: {
      location: app.location,
      type: app.type,
    },
  })) || [];

  return (
    <TimelineCard
      events={events}
      onEventPress={onAppointmentPress}
      showDateHeaders={true}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 12,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  dateBadge: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  dateBadgeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: colors.textTertiary,
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  eventTimeContainer: {
    width: 50,
    alignItems: 'center',
    position: 'relative',
  },
  eventTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginBottom: 4,
  },
  eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
  },
  eventContent: {
    flex: 1,
    marginLeft: 12,
    paddingLeft: 12,
    borderLeftWidth: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  eventTitleContainer: {
    flex: 1,
  },
  eventTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  eventSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
  },
  eventDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 18,
  },
  eventMetadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  metadataItem: {
    flexDirection: 'row',
    marginRight: 16,
    marginBottom: 4,
  },
  metadataLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: colors.textSecondary,
    marginRight: 4,
  },
  metadataValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textPrimary,
  },
  eventValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  eventValueText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: colors.textPrimary,
  },
  eventUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    marginLeft: 2,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewMoreText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primarySaffron,
    marginRight: 4,
  },
});

export default TimelineCard;