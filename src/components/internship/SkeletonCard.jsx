function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-badge" />
        <div className="skeleton-bookmark" />
      </div>
      <div className="skeleton-title">
        <div className="skeleton-company" />
        <div className="skeleton-role" />
      </div>
      <div className="skeleton-tags">
        <div className="skeleton-tag" />
        <div className="skeleton-tag" />
        <div className="skeleton-tag" />
      </div>
      <div className="skeleton-details">
        <div className="skeleton-detail" />
        <div className="skeleton-detail" />
        <div className="skeleton-detail" />
      </div>
      <div className="skeleton-button" />
    </div>
  );
}

export default SkeletonCard;