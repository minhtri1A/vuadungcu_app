if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/minhtri-ntl/.gradle/caches/8.14.3/transforms/e1242c86f794a0126cc864aec2525ab1/transformed/jetified-hermes-android-0.81.1-debug/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/minhtri-ntl/.gradle/caches/8.14.3/transforms/e1242c86f794a0126cc864aec2525ab1/transformed/jetified-hermes-android-0.81.1-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

