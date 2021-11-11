import React from 'react';
import { Link } from 'react-router-dom';
import ProfReviewShow from './prof_review_show';

class ProfReviewIndex extends React.Component {
    constructor(props) {
        super(props);

        this.tags = [
            'GIVES GOOD FEEDBACK', 'RESPECTED', 'LOTS OF HOMEWORK',
            'ACCESSIBLE OUTSIDE OF CLASS', 'GET READY TO READ',
            'PARTICIPATION MATTERS', "SKIP CLASS YOU WON'T PASS.",
            "INSPIRATIONAL", "GRADED BY FEW THINGS", "TEST HEAVY",
            "GROUP PROJECTS", "CLEAR GRADING CRITERIA", "HILARIOUS",
            "BEWARE OF POP QUIZZES", "AMAZING LECTURES", "LECTURE HEAVY",
            "CARING", "EXTRA CREDIT", "SO MANY PAPERS", "TOUGH GRADER"
        ]

        this.clickRateProf = this.clickRateProf.bind(this);
    };

    componentDidMount() {
        this.props.requestProf(this.props.match.params.profId)
    };

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.profId !== this.props.match.params.profId){
            this.props.requestProf(this.props.match.params.profId)
        }
    }

    getAvgQual(profReviews) {
        let sum = 0;
        if (profReviews.length === 0) return "N/A"
        for(let i = 0; i < profReviews.length; i++){
            sum += profReviews[i].quality
        }
        return sum / profReviews.length;
    }

    getAvgDiff(profReviews) {
        let sum = 0;
        if (profReviews.length === 0) return "N/A"
        for (let i = 0; i < profReviews.length; i++) {
            sum += profReviews[i].difficulty
        }
        return sum / profReviews.length;
    }

    getTakeAgRat(profReviews) {
        let count = 0;
        if (profReviews.length === 0) return "N/A"
        for (let i = 0; i < profReviews.length; i++) {
            if (profReviews[i].take_again) {
                count++
            }
        }
        return `${count / profReviews.length * 100}%`;
    }

    clickRateProf() {
        let path = `/profReviews/new/${this.props.prof.id}`
        this.props.history.push(path);
    }

    getTopTags(profReviews) {
        let tags_count = {};
        for (let i = 0; i < this.tags.length; i++) {
            tags_count[this.tags[i]] = 0
        };
        for (let i = 0; i < profReviews.length; i++) {
            if (this.tags.includes(profReviews[i].tag1)) {
                tags_count[profReviews[i].tag1] += 1
            }
            if (this.tags.includes(profReviews[i].tag2)) {
                tags_count[profReviews[i].tag2] += 1
            }
            if (this.tags.includes(profReviews[i].tag3)) {
                tags_count[profReviews[i].tag3] += 1
            }
        }
        let tagsCountArray = [];
        tagsCountArray.push(Object.keys(tags_count), Object.values(tags_count))
        let tagsCountTranspose = [];
        for (let i = 0; i < tagsCountArray[0].length; i++) {
            tagsCountTranspose.push([tagsCountArray[0][i], tagsCountArray[1][i]])
        }
        let topTags = [];
        let sortedCounts = Object.values(tags_count).sort().reverse();
        console.log(tags_count);
        for (let i = 0; i < sortedCounts.length; i++) {
            for (let j = 0; j < tagsCountTranspose.length; j++) {
                if (tagsCountTranspose[j][1] === sortedCounts[i] && topTags.length <= 5 && sortedCounts[i] && !topTags.includes(tagsCountTranspose[j][0])) {
                    topTags.push(tagsCountTranspose[j][0])
                } 
            }
        }
        return topTags;
    }


    render() {
        if (!this.props.prof) return null;
        const profReviews = Object.values(this.props.prof.prof_reviews);
        
        const avgQual = this.getAvgQual(profReviews);
        const avgDiff = this.getAvgDiff(profReviews);
        const takeAgRat = this.getTakeAgRat(profReviews);
        const topTags = this.getTopTags(profReviews);

        return (
            <div id='prof-review-index'>
                <div id='prof-review-index-prof-show'>
                    <div id='prof-show-quality-name'>
                        <div id='prof-show-avg-qual'>
                            <div>{avgQual}</div>
                            <div>Overall Quality Based on {profReviews.length} Ratings</div>
                        </div>
                        <div id='prof-review-index-prof-show-name'>
                            <div>{this.props.prof.first_name} {this.props.prof.last_name}</div>
                            <div>Prof in the {this.props.prof.subject} Department</div>
                        </div>
                    </div>
                    <div id='prof-show-other-stats'>
                        <div className='prof-show-other-stats'>
                            <div>{takeAgRat}</div>
                            <div>Would take again</div>
                        </div>
                        <div className='prof-show-other-stats'>
                            <div>{avgDiff}</div>
                            <div>Level of Difficulty</div>
                        </div>
                    </div>
                    <button onClick={this.clickRateProf}>Rate Prof {this.props.prof.first_name}</button>
                    <div>Prof {this.props.prof.first_name}'s Top Tags</div>
                    <div id='top-tags'>
                        {
                            topTags.map(tag => <div>{tag}</div>)
                        }
                    </div>
                </div>
                {/* <ul>
                    {
                        profReviews.map((profReview, index) => <ProfReviewShow key={index} profReview={profReview}/>)
                    }
                </ul>*/}
            </div>
        );
    };
};

export default ProfReviewIndex;