```js
import mongoose from "mongoose";

const durationSchema = new mongoose.Schema(
    {
        min: {
            type: Number,
            default: null
        },

        max: {
            type: Number,
            default: null
        }
    },
    {
        _id: false
    }
);

const teamMembersSchema = new mongoose.Schema(
    {
        min: {
            type: Number,
            default: null
        },

        max: {
            type: Number,
            default: null
        }
    },
    {
        _id: false
    }
);

const sourceSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            trim: true
        },

        input_category: {
            type: String,
            default: null,
            trim: true
        },

        input_page: {
            type: Number,
            default: null
        }
    },
    {
        _id: false
    }
);

const locationSchema = new mongoose.Schema(
    {
        city: {
            type: String,
            default: null,
            trim: true
        },

        state: {
            type: String,
            default: null,
            trim: true
        },

        country: {
            type: String,
            default: "India",
            trim: true
        }
    },
    {
        _id: false
    }
);

const performanceSchema = new mongoose.Schema(
    {
        duration_minutes: {
            type: durationSchema,
            default: () => ({})
        },

        team_members: {
            type: teamMembersSchema,
            default: () => ({})
        },

        genres: {
            type: [String],
            default: []
        },

        languages: {
            type: [String],
            default: []
        }
    },
    {
        _id: false
    }
);

const bookingSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            default: null,
            trim: true
        }
    },
    {
        _id: false
    }
);

const faqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true
        },

        answer: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        _id: false
    }
);

const mediaSchema = new mongoose.Schema(
    {
        videos: {
            type: [String],
            default: []
        },

        images: {
            type: [String],
            default: []
        }
    },
    {
        _id: false
    }
);

const searchSchema = new mongoose.Schema(
    {
        name_lower: {
            type: String,
            index: true
        },

        category_lower: {
            type: String,
            index: true
        },

        city_lower: {
            type: String,
            index: true
        },

        genres_lower: {
            type: [String],
            default: []
        },

        languages_lower: {
            type: [String],
            default: []
        }
    },
    {
        _id: false
    }
);

const artistSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            unique: true,
            sparse: true
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        category: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        source: {
            type: sourceSchema,
            required: true
        },

        location: {
            type: locationSchema,
            default: () => ({})
        },

        performance: {
            type: performanceSchema,
            default: () => ({})
        },

        booking: {
            type: bookingSchema,
            default: () => ({})
        },

        about: {
            type: String,
            default: ""
        },

        faq: {
            type: [faqSchema],
            default: []
        },

        media: {
            type: mediaSchema,
            default: () => ({})
        },

        search: {
            type: searchSchema,
            default: () => ({})
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

artistSchema.index({
    name: "text",
    about: "text",
    category: "text"
});

artistSchema.pre("save", function (next) {
    this.search = {
        name_lower: this.name?.toLowerCase() || "",

        category_lower: this.category?.toLowerCase() || "",

        city_lower: this.location?.city?.toLowerCase() || "",

        genres_lower:
            this.performance?.genres?.map(
                genre => genre.toLowerCase()
            ) || [],

        languages_lower:
            this.performance?.languages?.map(
                language => language.toLowerCase()
            ) || []
    };

    next();
});

const Artist = mongoose.model(
    "Artist",
    artistSchema
);

export default Artist;
```