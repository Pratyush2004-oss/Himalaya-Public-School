import { useUserStore } from "@/store/auth.store";
import { EventType } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  ViewToken,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ListHeaderComponent = () => {
  return (
    <Animated.View entering={FadeInDown.duration(500).delay(600).springify()}>
      <View className="relative items-center justify-center h-56 overflow-hidden bg-teal-50/70 rounded-2xl">
        {/* Decorative background elements */}
        <View className="absolute w-40 h-40 rounded-full bg-teal-100/50 -top-10 -left-10" />
        <View className="absolute w-40 h-40 rounded-full bg-teal-100/50 -bottom-10 -right-10" />

        {/* Central Icon */}
        <View className="items-center justify-center w-16 h-16 bg-teal-200/80 rounded-2xl">
          <Feather name="award" size={30} color="#14b8a6" />
        </View>
        {/* Surrounding Icons (simplified representation) */}
        <View className="absolute items-center justify-center w-10 h-10 rounded-lg top-5 left-10 bg-white/70 backdrop-blur-sm">
          <Feather name="book-open" size={20} color="#14b8a6" />
        </View>
        <View className="absolute items-center justify-center w-10 h-10 rounded-lg top-10 right-8 bg-white/70 backdrop-blur-sm">
          <Feather name="clipboard" size={20} color="#14b8a6" />
        </View>
        <View className="absolute items-center justify-center w-10 h-10 rounded-lg bottom-5 right-12 bg-white/70 backdrop-blur-sm">
          <Feather name="lock" size={20} color="#14b8a6" />
        </View>
        <View className="absolute items-center justify-center w-10 h-10 rounded-lg bottom-10 left-8 bg-white/70 backdrop-blur-sm">
          <Feather name="user-check" size={20} color="#14b8a6" />
        </View>

        <Text className="absolute text-xs font-outfit-medium bottom-4 text-teal-700/80">
          Swipe to View the Recent Events
        </Text>
      </View>
    </Animated.View>
  );
};

// Individual Carousel Item Component
const EventCarouselItem: React.FC<{ item: EventType; isViewable: boolean }> = ({
  item,
  isViewable,
}) => {
  const textTranslateY = useSharedValue(50);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    if (isViewable) {
      textTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      textOpacity.value = withTiming(1, { duration: 500 });
    } else {
      textTranslateY.value = withTiming(50, { duration: 300 });
      textOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [isViewable]);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ translateY: textTranslateY.value }],
    };
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View
      style={{ width: SCREEN_WIDTH }}
      className="items-center justify-center h-56"
    >
      <View className="relative w-[90%] h-full overflow-hidden shadow-lg bg-gray-200 rounded-2xl shadow-gray-400">
        <Image
          source={{ uri: item.image }}
          className="absolute inset-0 w-full h-full"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          className="absolute inset-0"
        />
        <Animated.View
          style={animatedTextStyle}
          className="absolute bottom-0 left-0 right-0 p-4"
        >
          <Text
            className="text-xl text-white font-outfit-bold"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <Text
            className="text-sm text-gray-300 font-outfit-medium"
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="calendar-clear-outline" size={16} color="white" />
            <Text className="ml-2 text-sm text-white/90 font-outfit-medium">
              {formatDate(item.date)}
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

// Main FlatList Component
const EventsFlatList = () => {
  const { eventsList } = useUserStore();
  const [viewableItems, setViewableItems] = useState<string[]>([]);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems: visibleItems }: { viewableItems: ViewToken[] }) => {
      const visibleIds = visibleItems.map((item) => item.key as string);
      setViewableItems(visibleIds);
    },
    []
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70, // Item is "viewable" if 70% is visible
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const filteredList = eventsList.filter((item) => item.public);
  if (filteredList.length === 0) {
    return (
      <Animated.View
        entering={FadeInUp.duration(500).springify()}
        style={{ width: SCREEN_WIDTH }}
        className="items-center justify-center h-56"
      >
        <View className="items-center justify-center w-[90%] h-full bg-gray-100 rounded-2xl shadow-md shadow-gray-200">
          <View className="items-center justify-center w-20 h-20 mb-4 bg-white rounded-full shadow-sm shadow-gray-300">
            <Ionicons name="calendar-outline" size={32} color="#9ca3af" />
          </View>
          <Text className="text-lg text-gray-700 font-outfit-bold">
            No Public Events
          </Text>
          <Text className="mt-1 text-sm text-gray-500 font-outfit">
            Check back later for new updates.
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <FlatList
      data={filteredList}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={ListHeaderComponent}
      ListHeaderComponentStyle={{ width: SCREEN_WIDTH }}
      horizontal
      pagingEnabled // This creates the carousel effect
      showsHorizontalScrollIndicator={false}
      snapToAlignment="center"
      decelerationRate="fast"
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      renderItem={({ item }) => (
        <EventCarouselItem
          item={item}
          isViewable={viewableItems.includes(item._id)}
        />
      )}
    />
  );
};

export default EventsFlatList;
