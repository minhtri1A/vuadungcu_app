if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/minhtri-ntl/.gradle/caches/8.14.3/transforms/680f02207a3137a7114fdfebdeebffa2/transformed/jetified-hermes-android-0.81.1-release/prefab/modules/libhermes/libs/android.arm64-v8a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/minhtri-ntl/.gradle/caches/8.14.3/transforms/680f02207a3137a7114fdfebdeebffa2/transformed/jetified-hermes-android-0.81.1-release/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

