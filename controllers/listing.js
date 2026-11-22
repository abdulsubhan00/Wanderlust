const Listing = require("../models/listing");

//for geo coding
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const { category, search } = req.query;

    let filter = {};

    // Category filtering
    if (category) {
        filter.tags = category;
    }

    // Exact location or country search (case-insensitive)
    if (search && search.trim()) {
        const searchValue = search.trim();

        // Escape special regex characters
        const escapedSearch = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const exactMatch = new RegExp(`^${escapedSearch}$`, "i");

        filter.$or = [
            { location: exactMatch },
            { country: exactMatch }
        ];
    }

    const everylisting = await Listing.find(filter);

    res.render("listings/index.ejs", {
        everylisting,
        selectedCategory: category,
        searchQuery: search || "",
        noResults: Boolean(search && search.trim() && everylisting.length === 0)
    });
};

module.exports.newListingform = (req,res)=>{
    res.render("listings/newlisting.ejs");
};

module.exports.newListing = async(req,res,next)=>{

    let response = await geocodingClient
        .forwardGeocode({
            query : req.body.listing.location,
            limit : 1,
        })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image={url,filename};
    newlisting.geometry = response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success","New Listing created successfully");
    res.redirect("/listings");
};

module.exports.editform = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found!!");
        return res.redirect("/listings");
    }

    let ogimage = listing.image.url;
    ogimage=ogimage.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,ogimage});
};


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.listing },
        {
            new: true,
            runValidators: true
        }
    );

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};


module.exports.deleteListing = async(req,res)=>{
    let{id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting)
    req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let currentlisting = await 
    Listing.findById(id).populate({path:"reviews",populate:{path : "author"}}).populate("owner");
    if(!currentlisting){
        req.flash("error","Listing not found!!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{currentlisting});
};