import { useState, useEffect } from "react";
import Button from "../Button/Button";
import { fetchReviews, sendReview } from "../http";
import { Link } from "react-router-dom";
import {
  calculateRadiusOfReviews,
  calculateVotesRadius,
  handleClickOnStars,
} from "./Reviews";
import styles from "./Reviews.module.css";
import ErrorModal from "../Modals/Error/ErrorModal";
import Modal from "../Modals/Modal/Modal";
export default function Reviews() {
  const [outCome, setOutcome] = useState({
    success: false,
    error: false,
  });
  const [userReview, setUserReview] = useState({
    text: "",
    name: "",
    votes: { app: 0, food: 0, service: 0 },
  });
  const [availableReviews, setAvailableReviews] = useState({
    showReviews: false,
    reviews: [],
  });

  function getInputValues(e) {
    const { name, value } = e.target;
    setUserReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  }

  async function handleReview(e) {
    e.preventDefault();
    if (
      userReview.text === "" ||
      userReview.name === "" ||
      userReview.votes.app === 0 ||
      userReview.votes.food === 0 ||
      userReview.votes.service === 0
    ) {
      setOutcome({ success: false, error: true });
    } else {
      try {
        await sendReview(userReview);
      } catch (error) {
        console.log(error);
      } finally {
        setOutcome({ success: true, error: false });
      }
    }
  }

  useEffect(() => {
    async function fetchAvailableReviews() {
      try {
        const reviews = await fetchReviews();
        setAvailableReviews((prev) => ({ ...prev, reviews: reviews }));
      } catch (error) {
        console.log(error);
      }
    }

    fetchAvailableReviews();
  }, [outCome.success]);

  return (
    <div id="reviews-container">
      <div id={styles.reviewsHeader}>
        <div>
          <Link to="/Home">
            <img id={styles.reviewsLogo} src="/public/logo.jpg" alt="logo" />
          </Link>
          <h1>REACTFOOD</h1>
        </div>
      </div>
      <div id={styles.appValutation}>
        <h2>Our service`s score!</h2>
        <div className={styles.appValutationStars}>
          {availableReviews.reviews?.length === 0 ? (
            ""
          ) : (
            <div>{calculateRadiusOfReviews(availableReviews).toFixed(1)}</div>
          )}
          {[1, 2, 3, 4, 5].map((numeroStella) => (
            <span key={numeroStella}>
              {numeroStella <= calculateRadiusOfReviews(availableReviews)
                ? "★"
                : "☆"}
            </span>
          ))}
          <div> - </div>
          <a
            onClick={() => {
              setAvailableReviews((prev) => ({
                ...prev,
                showReviews: !prev.showReviews,
              }));
            }}
          >
            {availableReviews.reviews?.length} reviews
          </a>
        </div>
      </div>

      {outCome.success ? (
        <div>
          <h2 className={styles.reviewSendSuccess}>Thanks for your review!</h2>
          <div className={styles.animation}>
            <img src="/WinnethePooh.gif" alt="" />
          </div>
        </div>
      ) : (
        <form id={styles.reviews}>
          <div id={styles.reviewsQuestions}>
            <div>
              <h2>What do you think about our App?</h2>
              <div>
                {[1, 2, 3, 4, 5].map((starNumber) => (
                  <span
                    key={starNumber}
                    onClick={() =>
                      handleClickOnStars(starNumber, "app", setUserReview)
                    }
                  >
                    {starNumber <= userReview.votes.app ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2>How about our service?</h2>
              <div>
                {[1, 2, 3, 4, 5].map((starNumber) => (
                  <span
                    key={starNumber}
                    onClick={() =>
                      handleClickOnStars(starNumber, "service", setUserReview)
                    }
                  >
                    {starNumber <= userReview.votes.service ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2>Did you like our food?</h2>
              <div>
                {[1, 2, 3, 4, 5].map((starNumber) => (
                  <span
                    key={starNumber}
                    onClick={() =>
                      handleClickOnStars(starNumber, "food", setUserReview)
                    }
                  >
                    {starNumber <= userReview.votes.food ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3>Let us know how to improve ourselves</h3>
            <label>Name</label>
            <input
              type="text"
              name="name"
              onChange={getInputValues}
              placeholder="Your name..."
            />
            <label>Review</label>
            <textarea
              className={styles.textarea}
              name="text"
              onChange={getInputValues}
              placeholder="Write here..."
              cols="30"
              rows="10"
            ></textarea>
          </div>

          <Button type="submit" onClick={handleReview}>
            Send Review
          </Button>
          <Modal open={outCome.error}>
            <ErrorModal
              onClose={() => setOutcome({ ...outCome, error: false })}
            />
          </Modal>
        </form>
      )}
      {availableReviews.showReviews && (
        <div className={styles.reviewsCards}>
          {availableReviews.reviews?.map((review) => (
            <div className={styles.review} key={review.id}>
              <div>{review.name}</div>
              {[1, 2, 3, 4, 5].map((numeroStella) => (
                <span key={numeroStella}>
                  {numeroStella <= calculateVotesRadius(review) ? "★" : "☆"}
                </span>
              ))}
              <p>{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
