if(NOT TARGET react-native-vision-camera::VisionCamera)
add_library(react-native-vision-camera::VisionCamera SHARED IMPORTED)
set_target_properties(react-native-vision-camera::VisionCamera PROPERTIES
    IMPORTED_LOCATION "/Users/minhtri-ntl/Desktop/projects/vuadungcu_app/node_modules/react-native-vision-camera/android/build/intermediates/cxx/RelWithDebInfo/3p342u3l/obj/arm64-v8a/libVisionCamera.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/minhtri-ntl/Desktop/projects/vuadungcu_app/node_modules/react-native-vision-camera/android/build/headers/visioncamera"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

