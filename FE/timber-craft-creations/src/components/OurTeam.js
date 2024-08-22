function OurTeam() {

    let ourTeam=[{
        id:1,
        name:"Vinod Singh",
        title: "Chief Visionary & Master Designer",
        about:"The creative force behind TimberCraft Creations, leading the design journey with an unwavering passion for custom furniture. His visionary approach ensures each piece embodies the essence of elegance and craftsmanship."
    },{
        id:2,
        name:"Uma Kayal",
        title: "Code Maestro & Digital Storyteller",
        about:"The technical artist behind TimberCraft Creations’ backend, ensuring smooth functionality while also weaving the brand's narrative across social media, connecting with customers through compelling stories of design and craftsmanship."
    },{
        id:3,
        name:"Shine John",
        title: "Master of Craft",
        about:"Meticulously brings TimberCraft Creations’ designs to life, infusing each product with precision and care. His dedication to excellence results in furniture that is both elegant and enduring."
    },{
        id:4,
        name:"Saurav Sahane",
        title: "Craftsmanship Connoisseur",
        about:"Skillfully transforms TimberCraft Creations' designs into tangible works of art. His expert craftsmanship ensures every piece is a perfect blend of beauty and functionality."
    }];


    return (
        <>

            {/* Start Team Section */}
                <div className="container">

                    <div className="row mb-5">
                        <div className="col-lg-5 mx-auto text-center">
                            <h2 className="section-title">Our Team</h2>
                        </div>
                    </div>

                    <div className="row">
                        {ourTeam?.map((team, index) => (
                        
                        <div className="col-12 col-md-6 col-lg-3 mb-5 mb-md-0">
                            <img src={`/images/team${team.id}.jpg`} className="img-fluid mb-5" />
                            <h3 clas>
                                {/* <a href="#"> */}
                                <span className="">{team.name}</span>
                                {/* </a> */}
                                </h3>
                            <span className="d-block position mb-4">{team.title}</span>
                            <p>{team.about}</p>
                            {/* <p className="mb-0"><a href="#" className="more dark">Learn More <span className="icon-arrow_forward"></span></a></p> */}
                        </div>

                        ))}

                    </div>
                </div>


        </>
    );
}

export default OurTeam;
